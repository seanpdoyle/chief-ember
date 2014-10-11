import Ember from 'ember';
import Upload from 'chief/models/upload';
import config from '../config/environment';
/* global $ */
/* global unescape */

export default Ember.FileField.extend({
  multiple: true,
  uploads: [],

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
    var self = this;
    var uploads = this.get('uploads');
    var upload = Upload.create({ file: file });
    var uploader = Ember.S3Uploader.create({url: config.APP.API_HOST + '/sign'});

    uploader.on('didUpload', function(event) {
      var locationUrl = $(event).find('Location')[0].textContent;
      var uploadedUrl = unescape(locationUrl);

      upload.set('url', uploadedUrl);

      self.sendAction('action', upload);
    });

    uploader.on('progress', function(event) {
      upload.set('progress', event.percent);
    });

    this.previewImage(upload);
    uploads.pushObject(upload);
    uploader.upload(file);
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
