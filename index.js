const listenPort = 5000;
const app = require("./server.js");
const server = require('http').createServer(app);
const io = require('socket.io')(server);

server.listen(listenPort, () => console.log(`App listening on port ${listenPort}`));

io.on('connect', socket => {
    console.log('connect');
    // sends nani to website
    io.emit('newdata', "nani");
});