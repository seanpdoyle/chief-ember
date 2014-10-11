import Ember from 'ember';
import Upload from 'chief/models/upload';
import config from '../config/environment';
/* global $ */
/* global async */
/* global unescape */

export default Ember.FileField.extend({
  concurrency: 3,
  multiple: true,
  uploads: [],
  queue: function() {
    var self = this;
    return async.queue(function(upload, taskCompleted) {
      var uploader = upload.get('uploader');
      var file = upload.get('file');

      uploader.on('didUpload', function(event) {
        var locationUrl = $(event).find('Location')[0].textContent;
        var uploadedUrl = unescape(locationUrl);

        upload.set('url', uploadedUrl);

        self.sendAction('action', upload);
        taskCompleted();
      });

      uploader.upload(file);
    }, this.get('concurrency'));
  }.property(),

  uploadFiles: function() {
    var files = this.get('files');

    if (Ember.isEmpty(files)) {
      return;
    }

    for(var i = 0; i < files.length; i++) {
      var file = files[i];

      this.uploadFile(file);
    }
  }.observes('files'),

  uploadFile: function(file) {
    var queue = this.get('queue');
    var uploads = this.get('uploads');
    var upload = Upload.create({ file: file });
    var uploader = Ember.S3Uploader.create({url: config.APP.API_HOST + '/sign'});

    uploader.on('progress', function(event) {
      upload.set('progress', event.percent);
    });
    upload.set('uploader', uploader);

    this.previewImage(upload);
    uploads.pushObject(upload);
    queue.push(upload);
  },

  previewImage: function(upload) {
    var file = upload.get('file');
    var reader = new FileReader();

    reader.onloadend = function() {
      upload.set('original', this.result);
    };

    reader.readAsDataURL(file);
  }
});
