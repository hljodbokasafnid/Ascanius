const spawn = require("child_process").spawn;

exports = module.exports = function (io) {
    // Using the socket io, while connected if uploaded is called from client
    // Run the main script and emit the data to the server so we can read it client side
    io.sockets.on('connection', function (socket) {
        socket.on('uploaded', function (book_name) {
            var process = spawn('python3', ['./main.py', book_name]);

            process.stdout.on('data', function (data) {
                // Receive progress from aeneas script
                // Refresh the page when the process is done and no error was raised
                // process.on exit couldn't differientiate between a clean exit and a forced exit
                if (new Buffer(data, 'utf-8').toString() == 'Done\n') {
                    var currentTime = new Date().toLocaleTimeString('en-GB');
                    io.emit('newdata', `${currentTime} - Refreshing.. Please Wait\n${currentTime} - Complete\n`);
                    io.emit('refresh');
                } else {
                    io.emit('newdata', new Buffer(data, 'utf-8').toString());
                }
            });

            process.stderr.on('data', function (data) {
                // Errors also get relayed, in case of crashes. Also no refresh.
                io.emit('newdata', new Buffer(data, 'utf-8').toString());
            });
        });
    });
}