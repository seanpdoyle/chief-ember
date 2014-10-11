import Ember from 'ember';

export default Ember.View.extend({
  classNameBindings: [
    ':image-item',
    'checked:active',
    'missingLocation:missing-location'
  ],
  tagName: 'li',
  templateName: 'image-item',

  checked: Ember.computed.alias('controller.checked'),
  missingLocation: Ember.computed.alias('controller.missingLocation')
});
