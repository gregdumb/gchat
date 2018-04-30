module.exports = (sequelize, types) => {
	const User = sequelize.define('User', {
		firstName: types.STRING,
		lastName: types.STRING,
		email: {
			type: types.STRING,
			isEmail: true,
		},
		passwordHash: types.STRING,
		passwordSalt: types.STRING,
	})
	
	User.associate = (models) => {
		models.User.belongsToMany(
			models.Conversation,
			{through: 'UserConversation', foreignKey: 'userId'}
		);
	}
	
	return User;
}