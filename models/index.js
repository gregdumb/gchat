var fs        = require('fs');
var path      = require('path');
var basename  = path.basename(__filename);
var Sequelize = require('sequelize');
var env       = process.env.NODE_ENV || 'development';
var config    = require('./config')[env];
var db        = {};

// Connect to database
var sequelize = new Sequelize(
    config.db.database,
    config.db.username,
    config.db.password,
    config.db
);

sequelize
    .authenticate()
    .then(() => {
		if(env != 'test') {
			console.log('Database connection established');
			console.log('\tDialect:', config.db.dialect);
			console.log('\tUsername:', config.db.username);
			console.log('\tDatabase:', config.db.database);
			console.log('\tHost:', config.db.host);
		}
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

// Find model files
fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file !== 'config.js') && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        var model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });

// Perform associations (if needed)
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;