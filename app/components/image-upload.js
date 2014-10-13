import Ember from 'ember';
import UploadStatus from 'chief/models/upload-status';
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
    return async.queue(function(uploadStatus, taskCompleted) {
      var uploader = uploadStatus.get('uploader');
      var file = uploadStatus.get('file');

      uploader.on('didUpload', function(event) {
        var locationUrl = $(event).find('Location')[0].textContent;
        var uploadedUrl = unescape(locationUrl);

        uploadStatus.set('url', uploadedUrl);

        self.sendAction('action', uploadStatus);
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
    var uploader = Ember.S3Uploader.create({url: config.APP.API_HOST + '/sign'});
    var uploadStatus = UploadStatus.create({ file: file, uploader: uploader });

    uploader.on('progress', function(event) {
      uploadStatus.set('progress', event.percent);
    });

    this.previewImage(uploadStatus);
    uploads.pushObject(uploadStatus);
    queue.push(uploadStatus);
  },

  previewImage: function(uploadStatus) {
    var file = uploadStatus.get('file');
    var reader = new FileReader();

    reader.onloadend = function() {
      uploadStatus.set('original', this.result);
    };

    reader.readAsDataURL(file);
  }
});
