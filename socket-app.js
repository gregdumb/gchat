
const auth = require('./utils/auth');

module.exports = function(server) {
	
	const io = require('socket.io')(server);
	
	io.use(async (socket, next) => {
		
		//console.log(socket.handshake);
		
		if(socket.handshake.query && socket.handshake.query.sessionKey) {
			
			let sessionKey = socket.handshake.query.sessionKey;
			let session = await auth.checkSession(sessionKey);
			
			if(session) {
				console.log("Session belongs to user", session.userId);
				next();
			}
			else {
				next(new Error('Authentication error'));
			}
		}
		else {
			console.log("There was error");
			next(new Error('Authentication error'));
		}
	})
	.on('connection', socket => {
		
	})
}