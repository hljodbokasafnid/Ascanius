// Requiring path and fs modules
const path = require('path');
const fs = require('fs');

function get_epub_files() {
    // Returns a list of books as zip files sorted by upload/creation date
    return new Promise(resolve => {
        epub_files = [];
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
                if (file.split('.').pop() === "epub") {
                    var stats = fs.statSync(path.join(directoryPath, file));
                    epub_files.push({ filename: file, date: stats.mtime });
                }
            });
            // Temporary print statement
            console.log(epub_files);
            // Return Zip Files Names / Ready Books (sorted by date)
            resolve(epub_files.sort((a, b) => b.date - a.date));
        });
    });
}

module.exports = {
    get_epub_files
}