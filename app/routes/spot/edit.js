import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return Ember.RSVP.hash({
      spot: this.store.find('spot', params.id),
      images: this.store.find('image')
    });
  }
});
