const Sequelize = require('sequelize');
const express = require('express');
const router = express.Router();
const models = require('../models');
const validation = require('../utils/validation');
const hasher = require('../utils/hasher');
const auth = require('../utils/auth');

router.post('/register', validation.user, async (req, res) => {
	
	const errors = validation.result(req);
	
	if(!errors.isEmpty()) {
		return res.status(400).json({error: errors.mapped()});
	}
	else {
		const {firstName, lastName, email, password} = req.body;
		
		const { passwordSalt, passwordHash } = hasher.saltAndHash(password);
		
		const user = await models.User.create({
			firstName,
			lastName,
			email,
			passwordSalt,
			passwordHash,
		});
		
		const session = await auth.createSession(user.id);
		res.cookie('sessionKey', session.sessionKey, { maxAge: 900000 });
		return res.status(200).json({session: { sessionKey: session.sessionKey }, user: user});
	}
})

router.post('/login', validation.login, async (req, res) => {
	const errors = validation.result(req);
	if(!errors.isEmpty()) {
		return res.status(400).json({error: errors.mapped()});
	}
	else {
		const {email, password} = req.body;
		const user = await models.User.findOne({where: { email }});
		
		if(user) {
			const savedSalt = user.passwordSalt;
			const savedHash = user.passwordHash;
			const matches = hasher.checkMatch(password, savedSalt, savedHash);
			
			if(matches) {
				const session = await auth.createSession(user.id);
				res.cookie('sessionKey', session.sessionKey, { maxAge: 900000 });
				return res.status(200).json({session: { sessionKey: session.sessionKey }, user: user});
			}
			else {
				return res.status(400).json({error: "Password incorrect"});
			}
		}
		else {
			return res.status(400).json({error: "Email not found"});
		}
	}
})

router.get('/continue', async (req, res) => {

	const { sessionKey } = req.cookies;

	if(!sessionKey) {
		return res.status(400).json({error: "No session sent"});
	}

	const session = await models.Session.findOne({where: { sessionKey }});

	if(!session) {
		return res.status(400).json({error: "Session key invalid"});
	}

	const user = await models.User.findOne({where: {id: session.userId}});

	if(!user) {
		return res.status(400).json({error: "Session user not found"});
	}

	return res.json({
		session: {
			sessionKey
		},
		user: user,
	})
})

module.exports = router;