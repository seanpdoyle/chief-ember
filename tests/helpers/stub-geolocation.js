import Ember from 'ember';
/* global navigator */
/* global localStorage */

export default function() {
  Ember.Test.registerHelper('stubLastLocation', function(location) {
    localStorage.setItem('lastLocation', JSON.stringify(location));
  });

  Ember.Test.registerHelper('stubGeolocation', function(location) {
    navigator.geolocation.getCurrentPosition = function(success) {
      success({
        position: {
          coords: location
        }
      });
    };
  });
}
