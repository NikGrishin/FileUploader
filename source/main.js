'use strict';

var DROP_ZONE = 'file-zone-dr',
    DROP_ZONE_HOVER = DROP_ZONE.concat('-hover'),
    DROP_ZONE_DROP = DROP_ZONE.concat('-drop');

var SERVER_LINK = 'http://127.0.0.1:1337/file';

require('./main.module/index.css');
var Main = require('./main.module');

var FileUploader = new Main.FileUploader(DROP_ZONE, (5160 * 1024), SERVER_LINK);

//Drag Zone Events

FileUploader.bind('dragover', function (event) {
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
        FileUploader.send();
    });

console.log(FileUploader.getDropZone());