import Ember from 'ember';
/* global EmberLeaflet */
/* global JpegMeta */

export default EmberLeaflet.MapView.extend({
  didInsertElement: function() {
    var map = L.map('map');
    var self = this;
    $('input[type=file]').change(function() {
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

    $.each(files, function(_, file) {
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
      controller.set('center', null);
      return;
    }

    $.each(files, function(_, file) {
      var binaryReader = new FileReader();

      binaryReader.onloadend = function() {
        var jpeg = new JpegMeta.JpegFile(this.result, file.name);
        var center = L.latLng(jpeg.gps.latitude, jpeg.gps.longitude);

        controller.set('orientation', 'orientation-' + jpeg.tiff.Orientation.value + '');
        controller.set('center', center);
      };

      binaryReader.readAsBinaryString(file);
    });
  }
});
