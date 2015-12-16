'use strict';

function FileUploader(dropZoneElementId, maxFileSize, serverLink) {
    this.dropZone = dropZoneElementId ? $(('#').concat(dropZoneElementId)) : undefined;
    this.maxFileSize = maxFileSize || 5160;
    this.serverLink = serverLink;

    this.file = null;

    this.message = '';

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
        this.setMessage('File is good');
    }

    return this;
};

FileUploader.prototype.setMessage = function(message) {
    this.message = message;
    alert(this.message);
    return this;
};

//backend-service
FileUploader.prototype.send = function() {
    var xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', this.handleUploadProgress, false);
    xhr.onreadystatechange = this.handleStateChange;

    xhr.open('POST', this.serverLink, true);

    xhr.setRequestHeader('X-FILE-NAME', this.file.name);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

    xhr.send(this.file);
};

FileUploader.prototype.handleUploadProgress = function(event) {
    var percent = parseInt(event.loaded / event.total * 100);
    FileUploader.prototype.setMessage.call(this, 'Loading: ' + percent + '%');
};

FileUploader.prototype.handleStateChange = function(event) {
    if (event.target.readyState == 4) {
        if (event.target.status == 200) {
            FileUploader.prototype.setMessage.call('Upload succesfull!');
        } else {
            this.fireError('Upload failed');
        }
    }
};

//helpers
FileUploader.prototype.bind = function(eventName, cb) {
    this.dropZone[0].addEventListener(eventName, cb, false);
    return this;
};

FileUploader.prototype.checkFileSize = function() {
    if (this.size > this.maxFileSize) {
        this.fireError('File is too big');
        return false;
    }

    return true;
};

FileUploader.prototype.fireError = function(message) {
    this.message = message;
    throw new Error(message);
};

module.exports.FileUploader = FileUploader;