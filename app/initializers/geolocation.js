import Ember from 'ember';

export default {
  name: 'geolocation',
  initialize: function() {
    Ember.Route.reopen({
      setupController: function(controller, model) {
        this._super(controller, model);

        navigator.geolocation.getCurrentPosition(function(position) {
          var location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          localStorage.setItem('lastLocation', JSON.stringify(location));

          controller.set('latitude', location.latitude);
          controller.set('longitude', location.longitude);
        });
      },

      lastLocation: function() {
        var location = localStorage.getItem('lastLocation') || '{}';

        return JSON.parse(location);
      }.property()
    });
  }
};
