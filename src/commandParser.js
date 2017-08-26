var RiotData = require('./riotdata/riotData');
var RiotClient = require('./riotClient');
var Consts = require('./consts');
var Utils = require('./utils');
var Messages = require('./messages');
var DiscordClient = require('./discordClient');
var Config = require('../config');
const Discord = require('discord.js');
const ytdl = require('ytdl-core');

const streamOptions = { seek: 0, volume: 1 };
var CommandParser = {};

CommandParser.parse = function(message) {
	var target = null;
	var rawCommand = message.content.substr(1);
	console.log('parse: ' + rawCommand);

	if ( (rawCommand.match(/"/g) || []).length == 2 || 
		(rawCommand.match(/'/g) || []).length == 2 ) {
		target = Utils.extractQuotedText(rawCommand)
		rawCommand = rawCommand.replace(target, '').replaceAll('\'', '').replaceAll('"', '').trim()
	}

	var commandParts = rawCommand.split(/\s+/);
	var command = CommandParser.commandTree;

	// TODO check requiredWords
	console.log('commandParts: ' + commandParts);
	if (commandParts.length > 2 && target == null) {
		target = commandParts[commandParts.length - 1];
		commandParts.pop();
	}
	for (i = 0; i < commandParts.length; i++) { 
	    command = command[commandParts[i]];
	}
	console.log('target: ' + target);
	return command(message, target);
};

CommandParser.riotCommand = function(m, t, e, qpName, qpVal, cb) {
	RiotClient.get(Utils.makeUrl(e, t, qpName, qpVal))
				.then((body) => cb(m, body))
				.catch((err) => console.error('Error in CommandParser.riotCommand: ' + err));
}

CommandParser.opggCommand = function(m, t, e, cb) {
	RiotClient.get(Utils.makeOpggUrl(e, t))
				.then((body) => cb(m, t, body))
				.catch((err) => console.error('Error in CommandParser.opggCommand: ' + err));
}

CommandParser.champCommand = function(m, c, qp, cb) {
	var endpoint = Consts.Endpoints.staticData.champion;
	c = c.toLowerCase();
	if (!RiotData.champions['data'][c]) {
		c = c.replace('\'', '').replace('"', '').replace(' ', '');
	}
	var champId = RiotData.champions['data'][c]['id'];
	CommandParser.riotCommand(m, champId, endpoint, endpoint.qp.champData.default, qp, cb);
}

CommandParser.itemCommand = function(m, i, qp, cb) {
	var endpoint = Consts.Endpoints.staticData.item;
	var itemId = RiotData.itemsByName[i.toLowerCase()]['id'];
	CommandParser.riotCommand(m, itemId, endpoint, endpoint.qp.itemData.default, qp, cb);
}

CommandParser.commandTree = {
	champ: {
		requiredWords: 3, 
		stats: function(m, c) {
			CommandParser.champCommand(m, c, Consts.Endpoints.staticData.champion.qp.champData.stats, 
				function(m, body) {DiscordClient.sendEmbed(m, Messages.getChampStats(m, body))});
		},
		allytips: function(m, c) {
			CommandParser.champCommand(m, c, Consts.Endpoints.staticData.champion.qp.champData.allytips, 
				function(m, body) {DiscordClient.sendEmbed(m, Messages.getAllyTips(m, body))});
		},
		enemytips: function(m, c) {
			CommandParser.champCommand(m, c, Consts.Endpoints.staticData.champion.qp.champData.enemytips, 
				function(m, body) {DiscordClient.sendEmbed(m, Messages.getEnemyTips(m, body))});
		},
		lore: function(m, c) {
			CommandParser.champCommand(m, c, Consts.Endpoints.staticData.champion.qp.champData.lore, 
				function(m, body) {
					var loreArr = Messages.getLore(m, body).match(/.{1,1999}/g);
					for (var i = 0;i<loreArr.length;i++) {
						DiscordClient.sendMessage(m, loreArr[i]);
					}
				});
		}
	},
	freetoplay: function(m ,t) {
		CommandParser.riotCommand(m, t, Consts.Endpoints.champion, Consts.Endpoints.champion.qp.freeToPlay.default,
				Consts.Endpoints.champion.qp.freeToPlay['true'],
				function(m, body) {
					var champs = JSON.parse(body).champions;
					var f2p = [];
					for (var i = 0;i<champs.length;i++) {
						f2p.push(RiotData.champsById[champs[i].id].key);
					}
					DiscordClient.sendEmbed(m, Messages.getFreeToPlay(m, f2p))
				});
	},
	help: function(m, t) {
		DiscordClient.sendMessage(m, '```Usage:\n\n ' +
		'`bot joinvc [voiceChannelName]\n ' +
		'`bot dcvc [voiceChannelName]\n ' +
		'`bot play [youtubeURL]\n ' +
		'`champ allytips [champName]\n ' +
		'`champ enemytips [champName]\n ' +
		'`champ lore [champName]\n ' +
		'`champ stats [champName]\n ' +
		'`freetoplay\n ' +
		'`help\n ' +
		'`item info [itemName]\n ' +
		'`summoner ranked [summonerName]\n ' +
		'`summoner rankedhistory [summonerName]\n ' +
		'`summoner runes [summonerName]\n ' +
		'`summoner normalhistory [summonerName]\n\n ' +
		'Tips:\n ' +
		'- Names are not case sensitive.\n ' +
		'- Names must be quoted if they contain spaces (eg "Warmog\'s Armor", "Master Yi")\n '+
		'```');
	},
	item: {
		requiredWords: 3, 
		info: function(m, t) {
			CommandParser.itemCommand(m, t, Consts.Endpoints.staticData.item.qp.itemData.all, 
				function(m, body) {DiscordClient.sendEmbed(m, Messages.getItemInfo(m, body))});
		}
	},
	bot: {
		joinvc: function(m, t) {
			for (var channelItem of DiscordClient.bot.channels) {
				var channel = channelItem[1];
				if (channel instanceof Discord.VoiceChannel) {
					if (channel.name == t) {
						m.reply(channel.name + " - " + channel.id);
						channel.join()
						.catch(function(e) {
							console.log(e);
						});
						break;
					}
				}
			}
		},
		dcvc: function(m, t) {
			for (var connItem of DiscordClient.bot.voiceConnections) {
				var conn = connItem[1];
				conn.disconnect();
			}
		},
		play: function(m, t) {
			for (var connItem of DiscordClient.bot.voiceConnections) {
				m.reply('playing: ' + t);
				var conn = connItem[1];
				var url = t.match(/(.*)/)[1];
				const stream = ytdl(url, {filter : 'audioonly'});
				const dispatcher = conn.playStream(stream, streamOptions);
			}
		}
	},
	summoner: {
		ranked: function(m, t) {
			CommandParser.opggCommand(m, t, Consts.OpggEndpoints.summary.ranked, 
				function(m, t, body) {DiscordClient.sendEmbed(m, Messages.getSummonerRank(m, t, body))});
		},
		rankedhistory: function(m, t) {
			CommandParser.opggCommand(m, t, Consts.OpggEndpoints.summary.ranked, 
				function(m, t, body) {DiscordClient.sendMessage(m, Messages.getSummonerHistory(m, t, body))});
		},
		runes: function(m, t) {
			CommandParser.opggCommand(m, t, Consts.OpggEndpoints.runes, 
				function(m, t, body) {DiscordClient.sendMessage(m, Messages.getSummonerRunes(m, t, body))});
		},
		normalhistory: function(m, t) {
			CommandParser.opggCommand(m, t, Consts.OpggEndpoints.summary, 
				function(m, t, body) {DiscordClient.sendMessage(m, Messages.getSummonerHistory(m, t, body))});
		}
	},
	noob: function(m, t) {
		DiscordClient.sendFile(m, Config.IMAGE_DIR + '/noob.jpg');
	},
	thanksto: function(m, t) {
		DiscordClient.sendMessage(m, '**DiscordCommandParser.by** @tomoko#3809\n' +
			'**Repo URL:** https://github.com/dperegolise/DiscordCommandParser.n' +
			'**Add CommandParser.URL:** https://discordapp.com/oauth2/authorize?client_id=243492121422594067&scope=CommandParser.permissions=0\n' +
			'**Thanks to:**\n@Silentshadow1991#9941 - For testing late into the night');
	}
}

module.exports = CommandParser;

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
