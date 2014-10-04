import Ember from 'ember';

export default Ember.ObjectController.extend({
  actions: {
    save: function() {
      this.transitionToRoute('spot', this.get('model').save());
      //
      // this.get('model').save().then(function(spot) {
      //   controller.transitionToRoute('spot', spot);
      // });
    }
  }
});
