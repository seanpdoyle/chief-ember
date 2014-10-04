import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource('spots', { path: '/' });
  this.route('spot.new', { path: '/spot/new' });
  this.resource('spot', { path: '/spot/:id' });
  this.resource('images');
  this.route('image', function() {
    this.route('new');
  });
});

export default Router;
