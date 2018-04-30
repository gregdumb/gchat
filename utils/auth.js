'use strict';

const hasher = require('./hasher');
const models = require('../models');

const auth = {};

auth.generateSessionKey = async () => {
	let isNotDuplicate = true;
	let key;
	
	while(isNotDuplicate) {
		key = hasher.randomHex(64);
		let session = await models.Session.findOne({where: { sessionKey: key }});
		
		if(session === null) {
			isNotDuplicate = false;
		}
	}
	
	return key;
}

auth.createSession = async (userId) => {
	const sessionKey = await auth.generateSessionKey();
	const session = await models.Session.create({ sessionKey, userId });
	
	return session;
}

module.exports = auth;