const spawn = require("child_process").spawn;
const { uuid } = require("uuidv4");

exports = module.exports = function (io) {
  // Using the socket io, while connected if uploaded is called from client
  // Run the main script and emit the data to the server so we can read it client side
  io.sockets.on('connection', function (socket) {
    // Create a unique ID for each connected "user"
    var user_id = uuid();
    // Create a room for each user so each user gets their emitted separate messages
    socket.join(user_id);
    socket.on('uploaded', function (folder_name, book_name) {
      var process = spawn('python3', ['./main.py', folder_name, book_name]);

      process.stdout.on('data', function (data) {
        // Receive progress from aeneas script
        // Refresh the page when the process is done and no error was raised
        // process.on exit couldn't differientiate between a clean exit and a forced exit
        if (new Buffer(data, 'utf-8').toString() == 'Done\n') {
          var current_time = new Date().toLocaleTimeString('en-GB');
          io.to(user_id).emit('newdata', `${current_time} - Refreshing.. Please Wait\n${current_time} - Complete\n`);
          io.to(user_id).emit('refresh');
        } else {
          io.to(user_id).emit('newdata', new Buffer(data, 'utf-8').toString());
        }
      });

      process.stderr.on('data', function (data) {
        // Errors also get relayed, in case of crashes. Also no refresh.
        io.to(user_id).emit('newdata', new Buffer(data, 'utf-8').toString());
        io.to(user_id).emit('error');
      });
    });
  });
}