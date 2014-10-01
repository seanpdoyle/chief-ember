import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource('spots', { path: '/' });
  this.resource('spot', function() {
    this.route('new');
  });
});

export default Router;
