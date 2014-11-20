import Ember from 'ember';
import GeoLocationMixin from 'chief/mixins/geolocation-mixin';

export default Ember.ArrayController.extend(GeoLocationMixin, {
  queryParams: ['latitude', 'longitude'],
  latitude: null,
  longitude: null,

  init: function() {
    this._super();

    var self = this;

    this.geolocation.start();
    this.geolocation.on('change', function(geoposition){
      var coords = geoposition.coords;
      var lastLocation = {
        latitude: coords.latitude,
        longitude: coords.longitude
      };

      localStorage.lastLocation = JSON.stringify(lastLocation);

      self.setProperties(lastLocation);
    });
  },

  destroy: function() {
    this._super();
    this.geolocation.stop();
  }
});
