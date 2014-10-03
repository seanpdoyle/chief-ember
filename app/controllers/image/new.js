import Ember from 'ember';

export default Ember.ObjectController.extend({
  orientation: function() {
    return 'orientation-' + this.get('model.orientation');
  }.property('model.orientation'),

  style: function() {
    if (!Ember.isEmpty(this.get('url'))) {
      return 'background-image: url("' + this.get('url') + '");';
    } else {
      return 'background-color: white;';
    }
  }.property('url')
});
