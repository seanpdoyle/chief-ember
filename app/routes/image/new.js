import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.store.createRecord('image');
  },

  actions: {
    imageUploaded: function(image) {
      this.transitionTo('image.share', image.id);
    }
  }
});
