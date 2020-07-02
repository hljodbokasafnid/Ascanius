const spawn = require("child_process").spawn;

function call_aeneas(book_name) {
    return new Promise(resolve => {
        var process = spawn('python3', ['./main.py', book_name]);

        process.stdout.on('data', function (data){
            // Receive progress from aeneas script
            // TODO relay progress to server/website
            console.log(new Buffer(data,'utf-8').toString());
        });

        process.stderr.on('data', function (data){
            //responseData += 'err: ' + data.toString();
            //TODO on error detection
            console.log(new Buffer(data,'utf-8').toString());
        });

        process.on('exit', function() {
            // Currently just a string, could have it return something more substancial
            resolve(book_name + " is zipped and ready");
        });
    });
}

module.exports = {
    call_aeneas
}