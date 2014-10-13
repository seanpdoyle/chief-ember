import Ember from 'ember';

export default Ember.View.extend({
  classNameBindings: ['complete', 'isError:failed', ':upload-status'],
  tagName: 'li',
  templateName: 'upload-status'
});
