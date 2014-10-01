import Ember from 'ember';
/* global JpegMeta */

export default Ember.View.extend({
  didInsertElement: function() {
    var self = this;
    Ember.$('input[type=file]').change(function() {
      self._readLocations(this.files);
      self._previewImages(this.files);
    });
  },

  _previewImages: function(files) {
    var controller = this.get('controller');

    if (Ember.isEmpty(files)) {
      controller.set('dataUrl', null);
      return;
    }

    Ember.$.each(files, function(_, file) {
      var dataUrlReader = new FileReader();

      dataUrlReader.onloadend = function() {
        controller.set('dataUrl', this.result);
      };

      dataUrlReader.readAsDataURL(file);
    });
  },

  _readLocations: function(files) {
    var controller = this.get('controller');

    if (Ember.isEmpty(files)) {
      controller.set('location', null);
      return;
    }

    Ember.$.each(files, function(_, file) {
      var binaryReader = new FileReader();

      binaryReader.onloadend = function() {
        var jpeg = new JpegMeta.JpegFile(this.result, file.name);
        var location = Ember.Object.create({
          latitude: jpeg.gps.latitude,
          longitude: jpeg.gps.longitude
        });

        controller.set('orientation', 'orientation-' + jpeg.tiff.Orientation.value + '');
        controller.set('location', location);
      };

      binaryReader.readAsBinaryString(file);
    });
  }
});
