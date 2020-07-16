const spawn = require("child_process").spawn;
var rimraf = require("rimraf");
const path = require("path");
const { uuid } = require("uuidv4");

exports = module.exports = function (io) {
  var web_sockets = {};
  // Using the socket io, while connected if uploaded is called from client
  // Run the main script and emit the data to the server so we can read it client side
  io.sockets.on('connection', function (socket) {
    var user_id = uuid();
    web_sockets[user_id] = socket;
    console.log(user_id);
    console.log('added ' + user_id + ' to ' + Object.getOwnPropertyNames(web_sockets));
    socket.on('uploaded_convert', function (book_name) {
      var book_path = './public/uploads/' + book_name;
      var output_path = './public/';

      // See list of optional commands here: https://daisy.github.io/pipeline/modules/daisy202-to-epub3/
      var process = spawn('dp2.exe', ['daisy202-to-epub3', '--href', book_path + '/ncc.html', '--output', output_path, '--epub-filename', book_name + '.epub', '-n', book_name]);
      //console.log(process['spawnargs']);

      process.stdout.on('data', function (data) {
        // Refresh the page when the process is done and no error was raised
        // Whenever SUCCESS is included in the data we conclude that we have finished and exit.
        var current_time = new Date().toLocaleTimeString('en-GB');
        if (new Buffer(data, 'utf-8').toString().includes("SUCCESS")) {
          io.emit('newdata', `${current_time} - Refreshing.. Please Wait\n${current_time} - Complete\n`);
          io.emit('refresh');
          // Clean up uploads folder for reupload and save space
          rimraf.sync(path.join(__dirname, '../public', 'uploads', book_name));
        } else if (new Buffer(data, 'utf-u').toString().includes("Error")) {
          // stderr.on does not work with the dp2.exe 
          // so if the data sent by stdout is includes error we can conclude that something didnt work
          io.emit('newdata', `${current_time}: \n` + new Buffer(data, 'utf-8').toString() + "\n");
          io.emit('error');
          // Clean up uploads folder for reupload and save space
          rimraf.sync(path.join(__dirname, '../public', 'uploads', book_name));
        } else {
          io.emit('newdata', `${current_time}: \n` + new Buffer(data, 'utf-8').toString() + "\n");
        }
      });
    });

    socket.on('close', function () {
      delete web_sockets[user_id];
      console.log("deleted:", user_id);
    });
  });
}