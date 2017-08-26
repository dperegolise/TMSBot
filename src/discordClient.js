const Discord = require('discord.js');

var DiscordClient = function() {


};

DiscordClient.bot = null;

DiscordClient.init = function() {
	DiscordClient.bot = new Discord.Client();
}

DiscordClient.sendEmbed = function(m, content) {
	console.log('sendEmbed');
	m.channel.sendEmbed(content)
}

DiscordClient.sendMessage = function(m, content) {
	try {
		m.channel.sendMessage(content)
	} catch (e) {
		console.log('Error in DiscordClient.sendMessage: ' + e);
	}
}

DiscordClient.sendFile = function(m, content) {
	try {
		m.channel.sendFile(content)
	} catch (e) {
		console.log('Error in DiscordClient.sendFile: ' + e);
	}
}

module.exports = DiscordClient;