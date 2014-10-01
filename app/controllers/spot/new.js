import Ember from 'ember';

export default Ember.Controller.extend({
  center: null,

  hasImage: Ember.computed.notEmpty('dataUrl'),

  style: function() {
    if (this.get('hasImage')) {
      return 'background-image: url("' + this.get('dataUrl') + '");';
    } else {
      return 'background-color: white;';
    }
  }.property('dataUrl', 'hasImage')

});
