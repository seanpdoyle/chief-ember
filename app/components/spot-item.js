import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: [':spot'],
  tagName: 'article',

  bearing: function() {
    var spot = this.get('content');

    return spot.bearingFrom(this.userLocation);
  }.property('userLocation', 'content'),

  distance: function() {
    var spot = this.get('content');

    return spot.distanceTo(this.userLocation);
  }.property('userLocation', 'content')
});
