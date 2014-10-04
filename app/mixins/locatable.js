import DS from 'ember-data';
import Ember from 'ember';

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
    return Ember.empty(this.get('latitude')) ||
      Ember.empty(this.get('longitude'));
  }.property('latitude', 'longitude'),
});
