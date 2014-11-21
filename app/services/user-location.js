import Ember from 'ember';
import Locatable from 'chief/mixins/locatable';

export default Ember.Object.extend(Locatable, {
  latitude: Ember.computed.alias('location.latitude'),
  longitude: Ember.computed.alias('location.longitude'),

  location: function() {
    var lastLocation;

    try {
      var encodedLastLocation = localStorage.lastLocation || "{}";
      lastLocation = JSON.parse(encodedLastLocation);
    } catch(_) {
      delete localStorage.lastLocation;
      lastLocation = {};
    }

    return lastLocation;
  }.property('localStorage.lastLocation'),

  push: function(location) {
    localStorage.lastLocation = JSON.stringify(location);
  }
});
