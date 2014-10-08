import Ember from 'ember';

export default Ember.ObjectController.extend({
  init: function() {
    this.get('checkedImages');
  },
  images: Ember.computed.filter('availableImages', function(image) {
    var spot = this.get('spot');
    var owner = image.get('spot');

    return Ember.isEmpty(owner) || Ember.isEqual(owner, spot);
  }),
  checkedImages: Ember.computed.filterBy('images', 'checked', true),

  attachImages: function() {
    var spot = this.get('spot');
    var images = spot.get('images');

    images.clear();

    this.get('checkedImages').forEach(function(image) {
      images.pushObject(image);
      image.set('spot', spot);
    });
  }.observes('checkedImages.[]'),

  actions: {
    save: function() {
      var spot = this.get('spot');
      this.transitionToRoute('spot', spot.save());
    },
    destroyImage: function(image) {
      image.destroyRecord();
    }
  }
});
