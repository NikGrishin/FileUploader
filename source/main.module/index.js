'use strict';

function FileUploader(dropZoneElementId, maxFileSize, serverLink, additionalHandlers) {
    this.dropZone = dropZoneElementId ? $(('#').concat(dropZoneElementId)) : undefined;
    this.maxFileSize = maxFileSize || 5160;
    this.serverLink = serverLink;

    this.file = null;

    this.message = '';

    this.additionalHandlers = additionalHandlers;

    if(!this.dropZone) {
        throw new Error('File uploader cannot work without dropzone');
    }
}

//getters
FileUploader.prototype.getDropZone = function() {
    return this.dropZone;
};

//setters
FileUploader.prototype.setFile = function(file) {
    this.file = file;

    if(this.checkFileSize()) {
        console.log('File is good');
    }

    return this;
};

FileUploader.prototype.setMessage = function(message) {
    this.message = message;
    return this;
};

//backend-service
FileUploader.prototype.send = function(uploadProgressCb, stateChangeCb) {
    var xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', uploadProgressCb, false);
    xhr.onreadystatechange = stateChangeCb;

    xhr.open('POST', this.serverLink, true);

    xhr.setRequestHeader('X-FILE-NAME', this.file.name);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

    xhr.send(this.file);
};

//helpers
FileUploader.prototype.bind = function(eventName, cb) {
    this.dropZone[0].addEventListener(eventName, cb, false);
    return this;
};

FileUploader.prototype.checkFileSize = function() {
    if (this.size > this.maxFileSize) {
        throw new Error('File is too big');
        return false;
    }

    return true;
};

module.exports.FileUploader = FileUploader;