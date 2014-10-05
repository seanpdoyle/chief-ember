import Ember from 'ember';
import Application from '../../app';
import Router from '../../router';
import config from '../../config/environments/test';
import stubLocation from '../helpers/stub-geolocation';

export default function startApp(attrs) {
  var App;

  var attributes = Ember.merge({}, config.APP);
  attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

  Router.reopen({
    location: 'none'
  });

  Ember.RSVP.on('error', function(reason) {
    console.assert(false, reason);
  });

  Ember.run(function() {
    App = Application.create(attributes);
    App.setupForTesting();
    App.injectTestHelpers();

    stubLocation();
  });

  App.reset(); // this shouldn't be needed, i want to be able to "start an app at a specific URL"

  return App;
}
