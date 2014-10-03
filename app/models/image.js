import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  latitude: DS.attr('number'),
  longitude: DS.attr('number'),
  orientation: DS.attr('integer'),
  original: DS.attr('string'),
  large: DS.attr('string'),
  thumbnail: DS.attr('string'),

  url: function() {
    return this.get('large') || this.get('original');
  }.property('original', 'large'),

  location: function(){
    return Ember.Object.create({
      latitude: this.get('latitude'),
      longitude: this.get('longitude')
    });
  }.property('latitude', 'longitude')
});
