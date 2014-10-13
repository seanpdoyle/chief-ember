import Ember from 'ember';

export default Ember.Object.extend({
  file: '',
  progress: 0,
  original: '',

  barWidth: function() {
    return 'width: ' + this.get('progress') + '%;';
  }.property('progress'),

  saved: Ember.computed.notEmpty('upload')
});
