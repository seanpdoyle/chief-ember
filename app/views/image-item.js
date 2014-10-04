import Ember from 'ember';

export default Ember.View.extend({
  classNameBindings: ['image', 'missingLocation:missing-location'],
  templateName: 'image-item'
});
