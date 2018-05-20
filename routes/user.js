const Sequelize = require('sequelize');
const express = require('express');
const router = express.Router();
const models = require('../models');
const validation = require('../utils/validation')

router.get('/', async (req, res) => {
	const users = await models.User.findAll();
	
	res.json(users);
})

router.route('/:id/conversations/')
.get(async (req, res) => {
	const { id } = req.params;
	const user = await models.User.findOne({ where: { id } });
	
	if(!user) {
		return res.status(400).json({error: 'User not found'});
	}
	
	try {
		
		console.log(models.UserConversation);
		
		const conversations = await models.Conversation.findAll({
			include: [{
				model: models.User,
				attributes: ['id', 'firstName', 'lastName'],
				through: {
					where: {userId: id}
				}
			}]
		});
		
		await conversations[0].addUser(user);
		
		res.json(conversations);
	}
	catch(error) {
		//console.log(error);
		res.status(400).json({error: "Get conversations failed"})
	}
})
.post(validation.conversation, async (req, res) => {
	const errors = validation.result(req);
	if(!errors.isEmpty()) return res.status(400).json({error: errors.mapped()});
	
	const user = await models.User.findOne({ where: { id: req.params.id } });
	if(!user) return res.status(400).json({error: 'User not found'});
	
	const newConvo = await models.Conversation.create();
	await newConvo.addUser(user.id);
	
	for(let u of req.body.userIds) {
		let targetUser = await models.User.findOne({ where: { id: u } });
		if(targetUser) await newConvo.addUser(targetUser.id);
		else console.log(`User ${u} not found`);
	}
	
	const convo = await models.Conversation.findOne({
		where: { id: newConvo.id },
		include: [{
			model: models.User
		}]
	})
	
	res.json(convo);
})

router.post('/:id/createconvo', async (req, res) => {
	
	const user1 = await models.User.findOne({ where: { id: req.params.id } });
	const user2 = await models.User.findOne({ where: { id: 2 }});
	
	if(!(user1 && user2)) return res.status(400).end();
	
	const newConvo = await models.Conversation.create();
	
	console.log(user1);
	
	await user1.addConversation(newConvo.id);
	await user2.addConversation(newConvo.id);
	
	res.json(newConvo);
})

module.exports = router;