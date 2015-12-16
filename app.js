'use strict';

const http = require('http'),
    querystring = require('querystring'),
    fs = require('fs');

const hostname = '127.0.0.1';
const port = 1337;

let post_data = '';

http.createServer((req, res) => {
    if(req.url === '/file') {
        if (req.method === 'GET') {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('We don\'t need no education\n');
        } else if (req.method === 'POST' || req.method === 'OPTIONS') {
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

                    res.writeHead(200, {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
                        'Access-Control-Allow-Headers': 'X-FILE-NAME, X-Requested-With, content-type'
                    });

                    res.end();
                });
            });
        }
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not found');
    }

}).listen(port, hostname, () => {
    console.log(`Ready to get some files`);
});