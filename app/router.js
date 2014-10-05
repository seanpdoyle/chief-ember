import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('nearby', { path: '/' });
  this.route('spot.new', { path: '/spot/new' });
  this.resource('spot', { path: '/spot/:id' });
  this.route('image', function() {
    this.route('new');
  });
  this.route('catchall', { path: '/*wildcard' });
});

export default Router;
