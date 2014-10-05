import Ember from 'ember';
import stubLastLocation from 'chief/tests/helpers/stub-last-location';
/* global navigator */

export default function(location) {
  stubLastLocation(location);
  navigator.geolocation.getCurrentPosition = function(success, failure) {
    if (location) {
      success({ coords: location });
    }
  };
}
