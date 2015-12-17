'use strict';

var DROP_ZONE = 'file-zone-dr',
    DROP_ZONE_HOVER = DROP_ZONE.concat('-hover'),
    DROP_ZONE_DROP = DROP_ZONE.concat('-drop');

var SERVER_LINK = 'http://127.0.0.1:1337/file',
    SOCKET_LINK = 'http://127.0.0.1:1338/';

require('./main.module/index.css');
require('./file-list.module/index.css');

var Main = require('./main.module');
var FileList = require('./file-list.module');

var socket = require('socket.io-client');
socket = socket(SOCKET_LINK);

var FileUploader = new Main.FileUploader(DROP_ZONE, (5160 * 1024), SERVER_LINK);
var FileListObject = new FileList('file-list');

var progress = $('div.progress'),
    progressBar = $('div.progress-bar');

socket.on('files', function(data) {
    FileListObject.fillList(data);
});

//Drag Zone Events
FileUploader
    .bind('dragover', function (event) {
    event.preventDefault();
    FileUploader.getDropZone().attr('id', DROP_ZONE_HOVER);
    return false;
})
    .bind('dragleave', function () {
        FileUploader.getDropZone().attr('id', DROP_ZONE);
        return false;
    })
    .bind('drop', function (event) {
        event.preventDefault();
        event.stopPropagation();

        FileUploader.getDropZone().attr('id', DROP_ZONE_DROP);

        FileUploader.setFile(event.dataTransfer.files[0]);

        FileUploader.send(handleUploadProgress, handleStateChange);

        socket.emit('file');
    });

//Upload handlers
function handleUploadProgress(event) {
    var percent = parseInt(event.loaded / event.total * 100);

    progress.show();
    progressBar.attr('aria-valuenow', percent);
    progressBar.css('width', percent + '%');
    console.log(percent);
}

function handleStateChange(event) {
    if (event.target.readyState == 4) {
        if (event.target.status == 200) {
            console.log('Upload successfull');

            FileUploader.getDropZone().attr('id', DROP_ZONE);

            socket.emit('fileUploaded');

            setTimeout(function() {
                progress.hide();
            }, 350);

        } else {
            throw new Error('Upload failed');
        }

    }
}