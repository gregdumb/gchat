module.exports = (sequelize, types) => {
	const Message = sequelize.define('Message', {
		contents: types.STRING,
		delivered: types.BOOLEAN,
		seen: types.BOOLEAN,
	})
	
	Message.associate = models => {
		models.Message.belongsTo(models.User, {foreignKey: 'senderId'});
		models.Message.belongsTo(models.Conversation, {foreignKey: 'conversationId'});
	}
	
	return Message;
}