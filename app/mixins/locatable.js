import DS from 'ember-data';
import Ember from 'ember';
/* global geolib */

export default Ember.Mixin.create({
  latitude: DS.attr('number'),
  longitude: DS.attr('number'),

  hasLocation: Ember.computed.not('missingLocation'),

  location: function(){
    return Ember.Object.create({
      latitude: this.get('latitude'),
      longitude: this.get('longitude')
    });
  }.property('latitude', 'longitude'),

  missingLocation: function() {
    var missingLatitude = Ember.isEmpty(this.get('latitude'));
    var missingLongitude = Ember.isEmpty(this.get('longitude'));

    return missingLatitude || missingLongitude;
  }.property('latitude', 'longitude'),

  bearingFrom: function(locatable) {
    if (this.get('hasLocation') && locatable.get('hasLocation')) {
      var otherLocation = locatable.getProperties('latitude', 'longitude');
      var location = this.getProperties('latitude', 'longitude');
      var bearing = geolib.getCompassDirection(otherLocation, location);

      return bearing.exact;
    }
  },

  distanceTo: function(locatable) {
    if (this.get('hasLocation') && locatable.get('hasLocation')) {
      var otherLocation = locatable.getProperties('latitude', 'longitude');
      var location = this.getProperties('latitude', 'longitude');
      var meters = geolib.getDistance(otherLocation, location);

      return geolib.convertUnit('mi', meters);
    }
  }
});
