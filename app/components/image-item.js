import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: [
    ':image-item',
    'checked:active',
    'missingLocation:missing-location'
  ],

  checked: function() {
    var selected = this.get('selected');
    var image = this.get('content');

    return selected.contains(image);
  }.property('selected.[]'),

  selected: [],
  tagName: 'li',
  missingLocation: Ember.computed.alias('content.missingLocation'),

  actions: {
    destroy: function() {
      this.get('content').destroyRecord();
    },

    select: function() {
      var image = this.get('content');

      this.sendAction('select', image);
    }
  }
});
