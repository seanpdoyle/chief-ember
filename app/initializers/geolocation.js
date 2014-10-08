import Ember from 'ember';
/* global geoPosition */


export default {
  name: 'geolocation',
  initialize: function() {
    Ember.Route.reopen({
      setupController: function(controller, model) {
        this._super(controller, model);
        if (!geoPosition.init()) { return; }

        geoPosition.getCurrentPosition(function(position) {
          var location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          localStorage.setItem('lastLocation', JSON.stringify(location));

          Ember.run(function() {
            controller.set('latitude', location.latitude);
            controller.set('longitude', location.longitude);
          });
        }
      },

      lastLocation: function() {
        var location;
        try {
          location = JSON.parse(localStorage.getItem('lastLocation'));
        } catch(_) {
          location = {};
        }
        return location;
      }.property()
    });
  }
};
