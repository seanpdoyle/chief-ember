import Ember from 'ember';

export default Ember.Object.extend({
  file: '',
  progress: 0,
  original: '',
  url: '',

  barWidth: function() {
    return 'width: ' + this.get('progress') + '%;';
  }.property('progress'),

  saved: Ember.computed.notEmpty('image')
});
