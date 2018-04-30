'use strict';

const socketIO = require('socket.io');

module.exports = (server) => {
    const io = socketIO(server);

    io.on('connection', socket => {
        console.log("Connection to socket was made");
    })
}