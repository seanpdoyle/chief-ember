import Ember from "ember";
import config from '../config/environment';
/* global JpegMeta */
/* global $ */
/* global unescape */

export default Ember.FileField.extend({
  uploader: function() {
    var component = this;
    var model = this.get('model');
    var uploader = Ember.S3Uploader.create({
      url: config.APP.API_HOST + '/sign'
    });

    uploader.on('progress', function(event) {
      model.set('progress', event.percent);
    });

    uploader.on('didUpload', function(event) {
      var uploadedUrl = unescape($(event).find('Location')[0].textContent);

      model.set('file', uploadedUrl);
      model.save().then(function(model) {
        component.sendAction('action', model);
      });
    });

    return uploader;
  }.property(),

  readMetadata: function() {
    var file = this.get('files')[0];
    var model = this.get('model');
    var reader = new FileReader();

    reader.onloadend = function() {
      var meta = new JpegMeta.JpegFile(this.result, file.name);
      var location = Ember.Object.create({
        latitude: meta.gps.latitude,
        longitude: meta.gps.longitude
      });

      model.set('location', location);
      model.set('orientation', meta.tiff.Orientation.value);
    };

    if (file) {
      reader.readAsBinaryString(file);
    }
  }.observes('files', 'model'),

  previewImage: function() {
    var file = this.get('files')[0];
    var model = this.get('model');
    var reader = new FileReader();

    reader.onloadend = function() {
      model.set('original', this.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }.observes('files', 'model'),

  actions: {
    upload: function() {
      var files = this.get('files');

      if (!Ember.empty(files)) {
        this.get('uploader').upload(files[0]);
      }
    }
  }
});
