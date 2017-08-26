/*
  League mini game & stats for discord
*/

const DiscordClient = require('./discordClient');
DiscordClient.init();

var CommandParser = require('./commandParser');

const token = 'PLACE_DISCORD_TOKEN_HERE'

DiscordClient.bot.on('ready', () => {
  console.log('I am ready!');
  DiscordClient.bot.user.setGame('`help')
});

DiscordClient.bot.on('message', message => {

  if (message.content.startsWith('`') && message.author.bot == false) {
  	try {
  		CommandParser.parse(message);
  	} catch (err) {
  		message.reply('Incorrect syntax, scrub.');
  		console.log(err);
  	}
	
  }
});

DiscordClient.bot.login(token);
