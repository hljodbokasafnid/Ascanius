const listenPort = 5000;
const app = require("./server.js");
const server = require('http').createServer(app);
const io = require('socket.io')(server);
// Give aeneas access to the socket io
const aeneas = require('./libs/aeneas')(io)

server.listen(listenPort, () => console.log(`App listening on port ${listenPort}`));