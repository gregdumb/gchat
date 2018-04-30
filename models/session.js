module.exports = (sequelize, types) => {
	const Session = sequelize.define('Session', {
		sessionKey: {
			type: types.STRING,
			allowNull: false,
		},
		ip: {
			type: types.STRING,
			isIP: true,
		}
	})
	
	Session.associate = (models) => {
		models.Session.belongsTo(
			models.User,
			{foreignKey: 'userId'}
		)
	}
	
	return Session;
}