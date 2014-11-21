import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    latitude: { replace: true, refreshModel: true },
    longitude: { replace: true, refreshModel: true }
  },

  model: function(params) {
    return this.store.findQuery('spot', params);
  },

  beforeModel: function(transition) {
    var { latitude, longitude } = transition.queryParams || {};

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
        this.transitionTo({ queryParams: lastLocation });
      }
    }
  },

  actions: {
    refresh: function() {
      this.refresh();
    }
  }
});
