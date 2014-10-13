import Ember from 'ember';

export default Ember.Object.extend({
  file: '',
  progress: 0,
  original: '',
  upload: null,

  barWidth: function() {
    return 'width: ' + this.get('progress') + '%;';
  }.property('progress'),

  errors: Ember.computed.alias('upload.errors'),
  complete: Ember.computed.notEmpty('upload')
});
