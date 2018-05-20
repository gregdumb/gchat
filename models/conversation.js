module.exports = (sequelize, types) => {
	const Conversation = sequelize.define('Conversation', {
		test: types.STRING,
	})
	
	Conversation.associate = (models) => {
		models.Conversation.belongsToMany(
			models.User, 
			{through: 'UserConversation', foreignKey: 'conversationId'}
		);
		
		models.Conversation.hasMany(models.Message, {foreignKey: 'conversationId'});
	}
	
	return Conversation;
} 