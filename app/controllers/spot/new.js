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
    var images = this.get('spot.images');

    images.clear();
    images.pushObjects(this.get('checkedImages'));
  }.observes('checkedImages.[]', 'images.@each'),


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
