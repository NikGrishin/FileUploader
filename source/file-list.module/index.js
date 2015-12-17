function FileList(listId) {
    this.listId = listId;
    this.listObject = $('#' + listId);
    this.data = [];
}

FileList.prototype.fillList = function(data) {
    this.data = JSON.parse(data.files);

    this.listObject.text('')// = '';

    this.data.forEach(function(file) {
        this.listObject.append( '<li>' + file + '</li>' );
    }.bind(this));
};

module.exports = FileList;