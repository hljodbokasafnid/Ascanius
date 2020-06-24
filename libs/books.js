// Requiring path and fs modules
const path = require('path');
const fs = require('fs');

function get_books() {
    return new Promise(resolve => {
        zip_files = [];
        // Joining path of directory 
        const directoryPath = path.join('public', 'output');
        // Passsing directoryPath and callback function
        fs.readdir(directoryPath, function (err, files) {
            // Handling error
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            } 
            // Listing all files using forEach
            files.forEach(function (file) {
                if (file.split('.').pop() === "zip") {
                    zip_files.push(file);
                }
            });
            // Temporary print statement
            console.log(zip_files);
            // Return Zip Files Names / Ready Books
            resolve(zip_files);
        });
    });
}

module.exports = {
    get_books
}