// Requiring path and fs modules
const path = require('path');
const fs = require('fs');

function getBooks(file_type) {
    // Returns a list of books as zip files sorted by upload/creation date
    return new Promise(resolve => {
        zip_files = [];
        // Joining path of directory 
        const directoryPath = path.join('public', 'output');
        // Passing directoryPath and callback function
        fs.readdir(directoryPath, function (err, files) {
            // Handling error
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            } 
            // Listing all files using forEach
            files.forEach(function (file) {
                if (file.split('.').pop() === file_type) {
                    var stats = fs.statSync(path.join(directoryPath, file));
                    zip_files.push({ filename: file, date: stats.mtime });
                }
            });
            // Temporary print statement
            // console.log(zip_files);
            // Return Zip Files Names / Ready Books (sorted by date)
            resolve(zip_files.sort((a, b) => b.date - a.date));
        });
    });
}

module.exports = {
    getBooks
}