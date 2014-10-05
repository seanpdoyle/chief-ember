import Ember from 'ember';

export default Ember.ArrayController.extend({
  reloadModel: function() {
    var latitude = this.get('latitude');
    var longitude = this.get('longitude');

    if (latitude && longitude) {
      var nearby = this.store.find('spot', {
        latitude: this.get('latitude'),
        longitude: this.get('longitude')
      });

      this.set('model', nearby);
    }
  }.observes('latitude', 'longitude')
});
