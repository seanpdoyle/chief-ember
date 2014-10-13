import Ember from 'ember';

export default Ember.ObjectController.extend({
  actions: {
    destroy: function() {
      this.get('model').destroyRecord();
    }
  }
});
