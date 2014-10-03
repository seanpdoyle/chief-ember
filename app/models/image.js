import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  latitude: DS.attr('number'),
  longitude: DS.attr('number'),
  orientation: DS.attr('integer'),
  url: DS.attr('string'),

  location: function(){
    return Ember.Object.create({
      latitude: this.get('latitude'),
      longitude: this.get('longitude')
    });
  }.property('latitude', 'longitude')
});
