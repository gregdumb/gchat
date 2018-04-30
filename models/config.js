var Sequelize = require('sequelize');

module.exports = {
    development: {
        db: {
            dialect: 'sqlite',
            storage: './db/db.development.sqlite',
            logging: false,
            operatorsAliases: Sequelize.Op,
            sync: {force: false}
        }
	},
	test: {
		db: {
			dialect: 'sqlite',
			storage: './db/db.test.sqlite',
			logging: false,
			operatorsAliases: Sequelize.Op,
			sync: {force: true}
		}	
	},
    production: {
        db: {
            dialect: process.env.DB_DIALECT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            host: process.env.DB_HOSTNAME,
            logging: false,
            operatorsAliases: Sequelize.Op
        }
    }
}