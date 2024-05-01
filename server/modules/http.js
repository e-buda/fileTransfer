const express = require('express');
const path = require('path');
app = express();

app.use(express.static(path.resolve(__dirname, '..','dist')));
// let the react app to handle any unknown routes
// serve up the index.html if express does'nt recognize the route

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..','dist','index.html'));
});

let server = null;
const startHttp = () => {
    server = app.listen(3100, () => {
        console.log(`HTTP server started on port ${3100}`);
    });
};

const stopHttp = () => {
    if (server) {
        server.close(() => {
            console.log('HTTP server stopped');
        });
        server = null;
    } else {
        console.log('HTTP server is not running');
    }
};
module.exports = {startHttp,stopHttp}
