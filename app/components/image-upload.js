import Ember from "ember";
import config from '../config/environment';
/* global JpegMeta */

export default Ember.FileField.extend({
  model: Ember.Object.create({}),
  style: 'width: 0%',

  uploader: function() {
    var component = this;
    var model = this.get('model');
    var uploader = Ember.Uploader.create({
      url: config.APP.API_HOST + '/images',
      paramNamespace: 'image'
    });

    uploader.on('progress', function(event) {
      component.set('width', 'width: ' + event.percent + '%');
      model.set('style', event.percent);
    });

    uploader.on('didUpload', function(event) {
      var image = event.image;

      model.set('id', image.id);
      model.set('original', image.original);
      model.set('large', image.large);
      model.set('thumbnail', image.thumbnail);

      component.sendAction('action', model);
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
      model.set('thumbnail', this.result);
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
