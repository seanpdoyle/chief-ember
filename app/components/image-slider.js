import Ember from 'ember';
/* global $ */

export default Ember.Component.extend({
  didInsertElement: function() {
    $(this.get('element')).owlCarousel();
  }
});
