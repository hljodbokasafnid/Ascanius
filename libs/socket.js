const spawn = require("child_process").spawn;
const spawnSync = require("child_process").spawnSync;
const { v4: uuid } = require("uuid");

const fs = require("fs-extra");
const path = require("path");

exports = module.exports = function (io) {
  // Using the socket io, while connected if uploaded is called from client
  // Run the main script and emit the data to the server so we can read it client side
  io.sockets.on('connection', function (socket) {
    // Create a unique ID for each connected "user"
    var user_id = uuid();
    // Create a room for each user so each user gets their emitted separate messages
    socket.join(user_id);

    // Aeneas creating smil files
    socket.on('uploaded', async function (folder_name, book_name) {
      // Copy contents to output before working on the original
      var source = path.resolve(__dirname, "..", "public", "uploads", folder_name);
      var destination = path.resolve(__dirname, "..", "public", "output", folder_name);

      await fs.copy(source, destination, function (err) {
        if (err) {
          console.log('An error occured while copying the folder.')
          return console.error(err);
        }
      });

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
        // Remove the files from uploads and output in case of errors (in case python couldn't delete)
        fs.remove(source);
        fs.remove(destination);
      });
    });

    // Daisy Pipeline Converting Daisy 2.02 to Epub 3
    socket.on('uploaded_convert', async function (folder_name, book_name) {
      var book_path = './public/uploads/' + folder_name;
      var output_path = './public/';

      var preprocess = spawn('python3', ['./scripts/preprocess.py', folder_name, book_name]);
      preprocess.stdout.on('data', function (data) {
        var current_time = new Date().toLocaleTimeString('en-GB');
        io.to(user_id).emit('newdata', `${current_time}: \n` + new Buffer(data, 'utf-8').toString() + "\n");
      });

      preprocess.stderr.on('data', function (data) {
        var current_time = new Date().toLocaleTimeString('en-GB');
        io.to(user_id).emit('newdata', `${current_time}: \n` + new Buffer(data, 'utf-8').toString() + "\n");
        io.to(user_id).emit('error');
      });

      // See list of optional commands here: https://daisy.github.io/pipeline/modules/daisy202-to-epub3/
      var process = spawn('dp2', ['daisy202-to-epub3', '--href', book_path + '/ncc.html', '--output', output_path, '--epub-filename', folder_name + '.epub', '-n', folder_name]);

      process.stdout.on('data', function (data) {
        // Refresh the page when the process is done and no error was raised
        // Whenever SUCCESS is included in the data we conclude that we have finished and exit.
        var current_time = new Date().toLocaleTimeString('en-GB');
        if (new Buffer(data, 'utf-8').toString().includes("SUCCESS")) {
          io.to(user_id).emit('newdata', `${current_time} - Refreshing.. Please Wait\n${current_time} - Complete\n`);
          io.to(user_id).emit('refresh');
          // Clean up uploads folder for reupload and save space
          fs.remove(path.join(__dirname, '../public', 'uploads', folder_name))
        } else if (new Buffer(data, 'utf-8').toString().toLowerCase().includes("error")) {
          // stderr.on does not work with the dp2.exe 
          // so if the data sent by stdout is includes error we can conclude that something didnt work
          io.to(user_id).emit('newdata', `${current_time}: \n` + new Buffer(data, 'utf-8').toString() + "\n");
          io.to(user_id).emit('error');
          // Clean up uploads folder for reupload and save space
          fs.remove(path.join(__dirname, '../public', 'uploads', folder_name))
        } else {
          io.to(user_id).emit('newdata', `${current_time}: \n` + new Buffer(data, 'utf-8').toString() + "\n");
        }
      });
    });

    socket.on('uploaded_convert_batch', async function (parent_name) {
      var book_path = './public/uploads/' + parent_name;
      var output_path = './public/';
      var books = await fs.readdir(book_path);
      var succeeded = [];
      var failed = [];
      io.to(user_id).emit('newdata', `Converting all daisy books found in '${parent_name}' folder.\n`);
      for (var book in books) {
        var book_name = await (async function () {
          var book_files = await fs.readdir(book_path + '/' + books[book]);
          for (var file in book_files) {
            if (book_files[file].includes("html") && book_files[file] !== "ncc.html") {
              // Relay the book name if aeneas
              return book_files[file].split(".")[0];
            }
          }
        })();
        var current_time = new Date().toLocaleTimeString('en-GB');
        io.to(user_id).emit('newdata', `${current_time}: \n[${Number(book) + 1}/${books.length}] - ${books[book]} Conversion Started\n`);
        var preprocess = spawnSync('python3', ['./scripts/preprocess.py', parent_name + '/' + books[book], book_name]);
        // See list of optional commands here: https://daisy.github.io/pipeline/modules/daisy202-to-epub3/
        var process = spawnSync('dp2', ['daisy202-to-epub3', '--href', book_path + '/' + books[book] + '/ncc.html', '--output', output_path + '/output/' + parent_name, '--epub-filename', books[book] + '.epub', '-n', books[book]]);
        if (process.output.toString().includes('SUCCESS')) {
          var current_time = new Date().toLocaleTimeString('en-GB');
          io.to(user_id).emit('newdata', `${current_time}: \n[${Number(book) + 1}/${books.length}] - ${books[book]} Conversion Succeeded\n`);
          succeeded.push(books[book]);
        } else {
          var current_time = new Date().toLocaleTimeString('en-GB');
          io.to(user_id).emit('newdata', `${current_time}: \n[${Number(book) + 1}/${books.length}] - ${books[book]} Conversion Failed\n`);
          failed.push(books[book]);
          fs.writeFileSync(output_path + '/output/' + parent_name + book_name + '-failed.log', process.output.toString());
        }
      }
      var logstring = () => {
        var return_string = "===Conversion Log===\n\n";
        if (succeeded.length > 0) {
          return_string += "Succeeded Converting:\n";
          for (var i in succeeded) {
            return_string += `${succeeded[i]}\n`;
          }
          return_string += "\n";
        }
        if (failed.length > 0) {
          return_string += "Failed Converting:\n"
          for (var i in failed) {
            return_string += `${failed[i]}\n`;
          }
        }
        return return_string;
      };
      fs.writeFileSync(output_path + '/output/' + parent_name +'conversion.log', logstring());
      fs.remove(path.join(__dirname, '../public', 'uploads', parent_name));

      //Create ZIP File of epub files and log files then remove all files from output + parent folder

      var current_time = new Date().toLocaleTimeString('en-GB');
      io.to(user_id).emit('newdata', `${current_time} - Refreshing.. Please Wait\n${current_time} - Complete\n`);
      io.to(user_id).emit('refresh');
      // TODO make get current time function
    });
  });
}
