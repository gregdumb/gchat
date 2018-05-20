const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
const models = require('../models');

const validation = {};

validation.result = validationResult;

validation.user = [
	check('firstName').isLength({min: 1}),
	check('lastName').isLength({min: 1}),
	check('email').isEmail().trim().custom(email => {
		return models.User.findOne({where: {email}}).then(u => {
			if(u) throw new Error("Email already in use");
		})
	}),
	check('password').isLength({min: 4}).trim(),
]

validation.login = [
	check('email').isEmail().trim(),
	check('password').isLength({min: 4}).trim(),
]

validation.conversation = [
	check('userIds').isArray(),
]

module.exports = validation;