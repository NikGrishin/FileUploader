'use strict';

const http = require('http'),
    querystring = require('querystring'),
    fs = require('fs');

let io = require('socket.io');

const hostname = '127.0.0.1';
const frontend_host = 'http://localhost:8080';

const port = 1337;
const socket_port = 1338;

let post_data = '';
const headers = {
    'Access-Control-Allow-Origin': frontend_host,
    'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'X-FILE-NAME, X-Requested-With, content-type',
    'Access-Control-Allow-Credentials': 'true'
};

http.createServer((req, res) => {
    if (req.url === '/file' && req.method === 'POST' || req.method === 'OPTIONS') {
        req.setEncoding('binary');

        req.on('data', (chunk) => {
            post_data += chunk;
        });
        req.on('end', () => {
            fs.writeFile('./uploads/' + req.headers['x-file-name'], post_data, 'binary', (err, success) => {
                if (err) {
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end('fuck');
                }

                res.writeHead(200, headers);

                res.end();
            });
        });
    } else {
        res.writeHead(404, headers);
        res.end('Not Found');
    }

}).listen(port, hostname, () => {
    console.log(`Ready to get some files`);
});

io = io.listen(socket_port).set('origins', '*:*');

io.on('connection', (socket) => {
    getUploads(socket, io);

    socket.on('fileUploaded', function(data) {
        console.log('file uploaded');

        getUploads(socket, io);
    });

});

//Helpers
function getUploads(socket, io) {
    return fs.readdir('./uploads', (err, data) => {
        if(err) {
            throw err;
        }
        io.emit('files', {files: JSON.stringify( data )});
    });
}
