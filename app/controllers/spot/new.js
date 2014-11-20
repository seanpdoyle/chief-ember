import Ember from 'ember';

export default Ember.ObjectController.extend({
  images: Ember.computed.filter('availableImages', function(image) {
    var spot = this.get('spot');
    var owner = image.get('spot');

    return Ember.isEmpty(owner) || Ember.isEqual(owner, spot);
  }),

  selected: Ember.computed.alias('spot.images'),

  actions: {
    save: function() {
      var spot = this.get('spot');
      this.transitionToRoute('spot', spot.save());
    },

    select: function(image) {
      var selected = this.get('spot.images');

      if (selected.contains(image)) {
        selected.removeObject(image);
      } else {
        selected.pushObject(image);
      }
    }
  }
});
