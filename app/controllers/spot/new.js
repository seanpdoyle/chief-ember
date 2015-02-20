import Ember from 'ember';

export default Ember.Controller.extend({
  images: Ember.computed.filter('model.availableImages', function(image) {
    var spot = this.get('model.spot');
    var owner = image.get('model.spot');

    return Ember.isEmpty(owner) || Ember.isEqual(owner, spot);
  }),

  selected: Ember.computed.alias('model.spot.images'),

  actions: {
    save: function() {
      var spot = this.get('model.spot');
      this.transitionToRoute('model.spot', spot.save());
    },

    select: function(image) {
      var selected = this.get('model.spot.images');

      if (selected.contains(image)) {
        selected.removeObject(image);
      } else {
        selected.pushObject(image);
      }
    }
  }
});
