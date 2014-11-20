import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    latitude: { refreshModel: true },
    longitude: { refreshModel: true }
  },

  model: function(params) {
    return this.store.findQuery('spot', params);
  },

  beforeModel: function(transition, queryParams) {
    var { latitude, longitude } = queryParams || {};

    if (Ember.isEmpty(latitude) || Ember.isEmpty(longitude)) {
      var lastLocation;

      try {
        var encodedLastLocation = localStorage.lastLocation || "{}";
        lastLocation = JSON.parse(encodedLastLocation);
      } catch(_) {
        delete localStorage.lastLocation;
        lastLocation = {};
      }

      if (!Ember.isEmpty(lastLocation.latitude) &&
          !Ember.isEmpty(lastLocation.longitude)) {
        this.transitionTo('nearby', { queryParams: lastLocation });
      }
    }
  }
});
