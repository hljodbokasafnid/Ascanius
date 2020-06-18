const listenPort = 5000;
const app = require("./server.js");
app.listen(listenPort, () => console.log(`App listening on port ${listenPort}`));
