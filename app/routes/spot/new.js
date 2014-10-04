import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return Ember.RSVP.hash({
      images: this.store.find('image'),
      spot: this.store.createRecord('spot')
    });
  }
});
