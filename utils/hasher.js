'use strict';

const crypto = require('crypto');

const saltLength = 16;

const hasher = {};

hasher.randomHex = (length) => {
	return crypto.randomBytes(Math.ceil(length/2))
		.toString('hex')
		.slice(0,length);
}

hasher.sha512 = (password, salt) => {
	var hash = crypto.createHmac('sha512', salt);
	hash.update(password);
	const hexHash = hash.digest('hex');
	return hexHash;
}

hasher.saltAndHash = (password) => {
	const salt = hasher.randomHex(saltLength);
	const hash = hasher.sha512(password, salt);
	return {
		passwordSalt: salt,
		passwordHash: hash,
	}
}

hasher.checkMatch = (password, salt, hash) => {
	const newHash = hasher.sha512(password, salt);
	return newHash === hash;
}

module.exports = hasher;