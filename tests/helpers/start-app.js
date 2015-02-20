import Ember from 'ember';
import Application from '../../app';
import Router from '../../router';
import config from '../../config/environment';
/* global navigator */

export default function startApp(attrs) {
  var App;

  var attributes = Ember.merge({}, config.APP);
  attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

  Ember.run(function() {
    App = Application.create(attributes);
    App.setupForTesting();
    App.injectTestHelpers();
  });

  navigator.geolocation = {
    getCurrentPosition: function(_, failure) {
      failure();
    }
  };

  return App;
}
