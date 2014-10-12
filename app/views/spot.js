import Ember from 'ember';

export default Ember.View.extend({
  classNameBindings: [':spot'],
  tagName: 'article',
  templateName: 'spot'
});
