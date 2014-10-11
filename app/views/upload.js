import Ember from 'ember';

export default Ember.View.extend({
  classNameBindings: ['saved', 'failed'],
  tagName: 'li',
  templateName: 'upload',

  failed: Ember.computed.alias('controller.failed'),
  saved: Ember.computed.alias('controller.saved')
});
