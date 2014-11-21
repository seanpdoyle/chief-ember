import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this, this.setupCarousel);
  },

  contentDidChange: function() {
    Ember.run.scheduleOnce('afterRender', this, this.setupCarousel);
  }.observes('content.[]'),

  setupCarousel: function() {
    var content = this.get('content');

    this.$().owlCarousel({
      autoPlay: false,
      items: content.get('length'),
      lazyLoad: true,
      responsive: false
    });
  }
});
