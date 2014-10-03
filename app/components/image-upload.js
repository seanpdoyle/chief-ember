import Ember from "ember";
/* global JpegMeta */

export default Ember.FileField.extend({
  model: Ember.Object.create({}),

  uploader: function() {
    var model = this.get('model');
    var uploader = Ember.Uploader.create({
      url: '/images',
      paramNamespace: 'image'
    });

    uploader.on('progress', function(event) {
      model.set('progress', event.progress);
    });

    uploader.on('didUpload', function(event) {
      model.set('url', event.url);
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
      model.set('url', this.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }.observes('files', 'model'),

  actions: {
    upload: function() {
      this.get('uploader').upload(this.get('files')[0]);
    }
  }
});
