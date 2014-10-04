import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    var spot = this.store.createRecord('spot');
    this.store.find('image', params.id).then(function(image) {
      spot.get('images').pushObject(image);
    });
    return spot;
  }
});
