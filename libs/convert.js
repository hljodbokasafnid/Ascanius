const spawn = require("child_process").spawn;
var rimraf = require("rimraf");
const path = require("path");

exports = module.exports = function (io) {
  // Using the socket io, while connected if uploaded is called from client
  // Run the main script and emit the data to the server so we can read it client side
  io.sockets.on('connection', function (socket) {
    socket.on('uploaded_convert', function (book_name) {
      var book_path = './public/uploads/' + book_name;
      var output_path = './public/';

      // See list of optional commands here: https://daisy.github.io/pipeline/modules/daisy202-to-epub3/
      var process = spawn('dp2.exe', ['daisy202-to-epub3', '--href', book_path + '/ncc.html', '--output', output_path]);
      //console.log(process['spawnargs']);

      process.stdout.on('data', function (data) {
        // Refresh the page when the process is done and no error was raised
        // Whenever SUCCESS is included in the data we conclude that we have finished and exit.
        if (new Buffer(data, 'utf-8').toString().includes("SUCCESS")) {
          var currentTime = new Date().toLocaleTimeString('en-GB');
          io.emit('newdata', `${currentTime} - Refreshing.. Please Wait\n${currentTime} - Complete\n`);
          io.emit('refresh');
          // Clean up uploads folder for reupload and save space
          rimraf.sync(path.join(__dirname, '../public', 'uploads', book_name));
        } else if (new Buffer(data, 'utf-u').toString().includes("Error")) {
          // stderr.on does not work with the dp2.exe 
          // so if the data sent by stdout is includes error we can conclude that something didnt work
          io.emit('newdata', new Buffer(data, 'utf-8').toString());
          io.emit('error');
          // Clean up uploads folder for reupload and save space
          rimraf.sync(path.join(__dirname, '../public', 'uploads', book_name));
        } else {
          io.emit('newdata', new Buffer(data, 'utf-8').toString());
        }
      });
    });
  });
}