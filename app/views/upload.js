import Ember from 'ember';

export default Ember.View.extend({
  classNameBindings: ['isNew::saved', 'isError:failed'],
  tagName: 'li',
  templateName: 'upload'
});
