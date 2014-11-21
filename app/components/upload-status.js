import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: ['complete', 'isError:failed', ':upload-status'],
  complete: Ember.computed.alias('content.complete'),
  isError: Ember.computed.alias('content.isError'),
  tagName: 'li',
  templateName: 'upload-status'
});
