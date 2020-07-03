const spawn = require("child_process").spawn;

exports = module.exports = function (io) {
    // Using the socket io, while connected if uploaded is called from client
    // Run the main script and emit the data to the server so we can read it client side
    io.sockets.on('connection', function (socket) {
        socket.on('uploaded', function (book_name) {
            var process = spawn('python3', ['./main.py', book_name]);

            process.stdout.on('data', function (data) {
                // Receive progress from aeneas script
                // console.log(new Buffer(data, 'utf-8').toString());
                io.emit('newdata', new Buffer(data, 'utf-8').toString());
            });

            process.stderr.on('data', function (data) {
                // responseData += 'err: ' + data.toString();
                // console.log(new Buffer(data, 'utf-8').toString());
                // Errors also get relayed, in case of crashes.
                io.emit('newdata', new Buffer(data, 'utf-8').toString());
            });

            process.on('exit', function () {
                // Call the client to refresh the website
                io.emit('refresh');
            });
        });
    });
}