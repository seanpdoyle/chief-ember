import Ember from 'ember';

export default Ember.ArrayController.extend({
  queryParams: ['latitude', 'longitude'],
  latitude: null,
  longitude: null
});
