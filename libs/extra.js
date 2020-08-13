function getCurrentTime() {
    // Returns a list of books as zip files sorted by upload/creation date
    return new Date().toLocaleTimeString('en-GB');
}

const sleep = ms => new Promise(res => setTimeout(res, ms));

module.exports = {
    getCurrentTime,
    sleep
}