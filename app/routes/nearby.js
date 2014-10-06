import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    latitude: { refreshModel: true },
    longitude: { refreshModel: true }
  },
  model: function() {
    return this.store.findQuery('spot', this.get('lastLocation'));
  }
});
