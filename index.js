// DOTENV
const dotenv = require('dotenv');
dotenv.config();

const http = require('http');
const models = require('./models');
const app = require('./app');
const socketApp = require('./socket-app');

const port = process.env.PORT || 4000;
const env = process.env.NODE_ENV || 'development';

var server;
var io;

models.sequelize.sync({force: false})
.then(() => {
	server = http.createServer(app);
	server.listen(port);
	
	console.log("HTTP Server listening");
	console.log("\tPort:", port);
	console.log("\tEnvironment:", env);
	
	io = socketApp(server);
})

module.exports = server;