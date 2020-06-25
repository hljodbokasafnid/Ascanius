const spawn = require("child_process").spawn;

function call_aeneas(book_name) {
    return new Promise(resolve => {
        const process = spawn('python3', ['./main.py', book_name]);

        var responseData = "";

        process.stdout.on('data', function (data){
            responseData += data.toString();
            console.log(data);
        });

        process.stderr.on('data', function (data){
            responseData += 'err: ' + data.toString();
            console.log(responseData);
        });
        resolve("GREAT");
    });
}

module.exports = {
    call_aeneas
}