import Ember from 'ember';
/* global Swag */

export default {
  name: 'swag',
  initialize: function() {
    Swag.registerHelpers(Ember.Handlebars);
  }
};
