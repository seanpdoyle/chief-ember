import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  spot: DS.belongsTo('spot'),
  latitude: DS.attr('number'),
  longitude: DS.attr('number'),
  original: DS.attr('string'),
  large: DS.attr('string'),
  thumbnail: DS.attr('string'),

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

  url: function() {
    return this.get('large') || this.get('original');
  }.property('original', 'large')
});
