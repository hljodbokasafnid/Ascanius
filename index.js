const listenPort = 5000;
const app = require("./server.js");
const server = require('http').createServer(app);
const io = require('socket.io')(server);
// Give aeneas, convert access to the socket io
const aeneas = require('./libs/aeneas')(io)
const convert = require('./libs/convert')(io)

// Automatically create a version number based on repository
var getVersion = require('git-repo-version');
var version = getVersion({ shaLength: 0, includeDate: true });
var date = new Date(version.split(" ")[1]).toLocaleString('en-GB');
console.log("Running v" + version.split(" ")[0], "committed", date);

// Listen to server  
server.listen(listenPort, () => console.log(`App listening on port ${listenPort}`));