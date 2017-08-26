var rV12 = '/na/v1.2' // Region & version
var rV14 = '/na/v1.4' // Region & version

var hosts = {
	riot: 'https://global.api.pvp.net',
	opgg: 'http://localhost:1337'
}

/*
	Base API endpoint
*/

var endpoints = {
	default: '/api/lol'
}

/*
	Champion endpoint
*/

endpoints.champion = {
	default: endpoints.default + rV12 + '/champion',
	qp: { // Query params
		freeToPlay: {
			default: 'freeToPlay', // qp name
			'true': 'true', // qp value options
			'false': 'false'
		}
	}
}

/*
	Summoner endpoint
*/

endpoints.summoner = {
	default: endpoints.default + rV14 + '/summoner'
}
endpoints.summoner.byname = {
	default: endpoints.summoner.default + '/by-name',
	target: '$'
}

/*
	Static Data endpoint
*/

endpoints.staticData = {
	default: endpoints.default + '/static-data' + rV12, 
}
endpoints.staticData.item = {
	default: endpoints.staticData.default + '/item',
	target: '$',
	qp: {
		itemData: {
			default: 'itemData',
			all: 'all'
		}
	}
}
endpoints.staticData.champion = {
	default: endpoints.staticData.default + '/champion',
	target: '$',
	qp: {
		champData: {
			default: 'champData',
			stats: 'blurb,stats',
			allytips: 'allytips',
			enemytips: 'enemytips',
			lore: 'lore',
			skins: 'skins'
		}
	}
}

var opggEndpoints = {
	default: '/na'
}

opggEndpoints.summary = {
	default: opggEndpoints.default + '/summary/$'
}

opggEndpoints.summary.ranked = {
	default: opggEndpoints.summary.default + '/ranked'
}

opggEndpoints.runes = {
	default: opggEndpoints.default + '/runes/$'
}

/*
	Exports
*/

exports.Endpoints = endpoints;
exports.OpggEndpoints = opggEndpoints;
exports.Hosts = hosts;