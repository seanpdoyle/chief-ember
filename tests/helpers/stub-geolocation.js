import Ember from 'ember';
import stubLastLocation from 'chief/tests/helpers/stub-last-location';
/* global navigator */

export default function(location) {
  if (Ember.isEmpty(location)) {
    location = {
      latitude: 0,
      longitude: 0
    };
  }
  stubLastLocation(location);

  if (Ember.isEmpty(navigator.geolocation)) {
    navigator.geolocation = {};
  }

  navigator.geolocation.getCurrentPosition = function(resolve) {
    resolve({ coords: location });
  };
}
