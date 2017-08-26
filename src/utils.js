var Consts = require('./consts');
var Config = require('../config');

exports.sendHelp = function(message) {
	message.channel.sendMessage('Help dialogue');
};

// TODO: Support more than one query parameter, lol.
exports.makeUrl = function(endpoint, target, qpName, qpValue) {
	if(target) {
		var url = endpoint.default + '/' + target + '?api_key=' + Config.RIOT_API_KEY;
	} else {
		var url = endpoint.default + '?api_key=' + Config.RIOT_API_KEY;
	}
	if (qpName && qpValue) {
		url += '&' + qpName + '=' + qpValue;
	}
	return Consts.Hosts.riot + url;
};

exports.makeOpggUrl = function(endpoint, target) {
	return Consts.Hosts.opgg + endpoint.default.replace('$', target);
}

exports.extractQuotedText = function( str ){
  var ret = "";

  if ( (str.match(/"/g) || []).length == 2 ) {
    ret = str.match( /"(.*?)"/ )[1];
  } else if ( (str.match(/'/g) || []).length == 2 ) {
    ret = str.match( /'(.*?)'/ )[1];
  } else {
  	ret = str;
  }

  return ret;
}
