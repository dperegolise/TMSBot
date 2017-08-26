const Discord = require('discord.js');
var table = require('markdown-table');

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function round(number, precision) {
    var factor = Math.pow(10, precision);
    var tempNumber = number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
};


exports.getChampStats = function(m, champ) {
	champ = JSON.parse(champ);
	var baseAS = round(0.625 / (parseFloat(champ.stats.attackspeedoffset) + 1), 4);
	return {
	    color: 3447003,
	    author: {
	      name: champ.name,
	      icon_url: 'http://ddragon.leagueoflegends.com/cdn/7.3.3/img/champion/' + champ.key + '.png'
	    },
	    title: champ.title.capitalize(),
	    url: 'http://www.lolking.net/champions/' + champ.key.toLowerCase() + '#/overview',
	    description: champ.blurb.replaceAll('<br>',''),
	    fields: [{
	        name: 'Base stats HP:',
	        value: '\`\`\`' + table([
			  ['HP', 'HP/Lvl', 'HP Regen', 'HPR/Lvl', 'Move Speed'],
			  [champ.stats.hp, champ.stats.hpperlevel, champ.stats.hpregen, champ.stats.hpregenperlevel, champ.stats.movespeed]
			]) + '\`\`\`'
	      },
	      {
	        name: 'Base stats MP:',
	        value: '\`\`\`' + table([
			  ['MP', 'MP Regen', 'MP Regen/Lvl'],
			  [champ.stats.mp, champ.stats.mpregen, champ.stats.mpregenperlevel]
			]) + '\`\`\`'
	      },
	      {
	        name: 'Offensive stats:',
	        value: '\`\`\`' + table([
			  ['AD', 'AD/Lvl', 'Range', 'AS', 'AS/Lvl'],
			  [champ.stats.attackdamage, champ.stats.attackdamageperlevel, 
			  champ.stats.attackrange, baseAS, '+' + champ.stats.attackspeedperlevel + '%']
			]) + '\`\`\`'
	      },
	      {
	        name: 'Defensive stats:',
	        value: '\`\`\`' + table([
			  ['Armor', 'Armor/Lvl', 'Magic Resist', 'MR/Lvl'],
			  [champ.stats.armor, champ.stats.armorperlevel, champ.stats.spellblock, champ.stats.spellblockperlevel]
			]) + '\`\`\`'
	      }
	    ],
	    timestamp: new Date(),
	    footer: {
	      icon_url: m.author.avatarURL,
	      text: '@' + m.author.username
	    }
	}
}

exports.getAllyTips = function(m, tips) {
	tips = JSON.parse(tips);
	for(var i = 0;i<tips.allytips.length;i++) {tips.allytips[i] = '*' + tips.allytips[i] + '\n'}
	var tipString = tips.allytips.join('\n');
	return {
	    color: 3447003,
	    author: {
	      name: tips.name,
	      icon_url: 'http://ddragon.leagueoflegends.com/cdn/7.3.3/img/champion/' + tips.key + '.png'
	    },
	    title: tips.title.capitalize(),
	    url: 'http://gameinfo.na.leagueoflegends.com/en/game-info/champions/' + tips.key.toLowerCase(),
	    description: '',
	    fields: [{
	        name: 'Ally tips:',
	        value: tipString
	      }
	    ],
	    timestamp: new Date(),
	    footer: {
	      icon_url: m.author.avatarURL,
	      text: '@' + m.author.username
	    }
	}
}

exports.getEnemyTips = function(m, tips) {
	tips = JSON.parse(tips);
	for(var i = 0;i<tips.enemytips.length;i++) {tips.enemytips[i] = '*' + tips.enemytips[i] + '\n'}
	var tipString = tips.enemytips.join('\n');
	return {
	    color: 3447003,
	    author: {
	      name: tips.name,
	      icon_url: 'http://ddragon.leagueoflegends.com/cdn/7.3.3/img/champion/' + tips.key + '.png'
	    },
	    title: tips.title.capitalize(),
	    url: 'http://gameinfo.na.leagueoflegends.com/en/game-info/champions/' + tips.key.toLowerCase(),
	    description: '',
	    fields: [{
	        name: 'Enemy tips:',
	        value: tipString
	      }
	    ],
	    timestamp: new Date(),
	    footer: {
	      icon_url: m.author.avatarURL,
	      text: '@' + m.author.username
	    }
	}
}

exports.getLore = function(m, loreObj) {
	loreObj = JSON.parse(loreObj);
	var str = '**' + loreObj.key + ' Lore**\n*' + loreObj.title.capitalize() + '*\n' + loreObj.lore;
	return str.replaceAll('<br>', '\n');
}

exports.getFreeToPlay = function(m, f2p) {
	var champsStr = f2p.join('\n');
	return {
	    color: 3447003,
	    author: {
	      name: 'Free to play champions',
	      icon_url: m.client.user.avatarURL
	    },
	    title: 'View on leagueoflegends.com',
	    url: 'http://na.leagueoflegends.com/en/news/champions-skins/free-rotation',
	    description: '',
	    fields: [{
	        name: '...and they are:',
	        value: champsStr
	      }
	    ],
	    timestamp: new Date(),
	    footer: {
	      icon_url: m.author.avatarURL,
	      text: '@' + m.author.username
	    }
	}
}

exports.getItemInfo = function(m, item) {
	item = JSON.parse(item);
	var itemDesc = item.description.replaceAll('</unique>', '')
													.replaceAll('<br>', '\n')
													.replaceAll('</groupLimit>', '')
													.replaceAll('<groupLimit>', '')
													.replaceAll('</stats>', '**')
													.replaceAll('<stats>', '**')
													.replaceAll('</passive>', '*')
													.replaceAll('<passive>', '*')
													.replaceAll('</mana>', '')
													.replaceAll('<mana>', '')
													.replaceAll('<rules>', '*')
													.replaceAll('</rules>', '*')
													.replaceAll('</active>', '*')
													.replaceAll('<unique>', '')
													.replaceAll('<unlockedPassive>', '*')
													.replaceAll('</unlockedPassive>', '*')
													.replace(/(<a([^>]+)>)/ig, "*")
													.replaceAll("</a>", "*")
													.replace(/(<font([^>]+)>)/ig, "*")
													.replaceAll("</font>", "*");

	return {
		color: 3447003,
	    author: {
	      name: item.name,
	      icon_url: 'http://ddragon.leagueoflegends.com/cdn/7.3.3/img/item/' + item.id.toString() + '.png '
	    },
	    title: item.plaintext,
	    url: 'http://www.lolking.net/items/' + item.id.toString(),
	    description: itemDesc,
	    fields: [{
	        name: 'Gold cost:',
	        value: item.gold.total
	      },
	      {
	        name: 'Sells for:',
	        value: item.gold.sell
	      }
	    ],
	    timestamp: new Date(),
	    footer: {
	      icon_url: m.author.avatarURL,
	      text: '@' + m.author.username
	    }
	}
}

exports.getSummonerRank = function(m, t, summoner) {
	summoner = JSON.parse(summoner);
	var winRatio = summoner.data.winRatio.toString();
	var gameSumArr = [];
	for (var game of summoner.data.games) {
		gameSumArr.push([game.result, game.champion, game.kills, game.deaths, game.assists, game.cs, game.length]);
	}
	console.log(JSON.stringify([
			  ['V/D', 'Champ', 'K', 'D', 'A', 'CS', 'Length']
			].concat(gameSumArr)));
	return {
	    color: 3447003,
	    author: {
	      name: t,
	      icon_url: m.client.user.avatarURL
	    },
	    title: summoner.data.league,
	    url: 'https://na.op.gg/summoner/userName=' + encodeURIComponent(t),
	    description: 'Win Ratio ' + winRatio + '%',
	    fields: [{
	        name: 'Ranked Profile:',
	        value: '\`\`\`' + table([
			  ['LP', 'Wins', 'Losses'],
			  [summoner.data.lp, summoner.data.wins, summoner.data.losses]
			]) + '\`\`\`'
	      },
	      {
	        name: 'Last 20 games Summary:',
	        value: '\`\`\`' + table([
			  ['KDA', 'Wins', 'Losses'],
			  [summoner.data.recent.kdaRatio, summoner.data.recent.wins, summoner.data.recent.losses]
			]) + '\`\`\`'
	      },
	      {
	        name: 'Last 20 games Averages:',
	        value: '\`\`\`' + table([
			  ['Kills Avg', 'Deaths Avg', 'Assists Avg'],
			  [summoner.data.recent.killsAverage, summoner.data.recent.deathsAverage, summoner.data.recent.assistsAverage]
			]) + '\`\`\`'
	      }
	    ],
	    timestamp: new Date(),
	    footer: {
	      icon_url: m.author.avatarURL,
	      text: '@' + m.author.username
	    }
	}
}

exports.getSummonerHistory = function(m, t, summoner) {
	summoner = JSON.parse(summoner);
	var winRatio = summoner.data.winRatio.toString();
	console.log(winRatio);
	var gameSumArr = [];
	var i = 0;
	for (var game of summoner.data.games) {
		if (i < 20) {i++;} else {break;}
		gameSumArr.push([game.length, game.result, game.champion, game.kills, game.deaths, game.assists, game.cs, game.level, game.spell1, game.spell2]);
	}
	console.log(gameSumArr);
	return '\`\`\` \n ' +
			'Last 20 Games \n ' +
			'==================== \n\n' + 
			table([
			  ['Length', 'Result', 'Champ', 'K', 'D', 'A', 'CS', 'Level', 'S1', 'S2']
			].concat(gameSumArr)) + '\`\`\`';
}

exports.getSummonerRunes = function(m, t, runePages) {
	runePages = JSON.parse(runePages);
	var msg = '\`\`\` \n ' +
			'Runes for ' + t + ' \n ' +
			'======================= \n\n';
	for (var runePage of runePages.data) {
		msg += 'Rune Page: ' + runePage.title + '\n' +
			   '--------------------------\n' ;
		for (var runeType in runePage) {
			if (runeType == 'title') continue;
			msg += runeType + ': ';
			for(var rune of runePage[runeType]) {
				if (!rune.count) {
					rune.count = '?';
				}
				msg += 'x' + rune.count.toString() + ' ' + rune.name + ', ';
			}
			msg = msg.substring(0, msg.length-2);
			msg += '\n';
		}
		msg += '\n';
	}
	msg += '\`\`\`';
	return msg;
}