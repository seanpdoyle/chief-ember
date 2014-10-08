import Ember from 'ember';
import stubLastLocation from 'chief/tests/helpers/stub-last-location';
/* global geoPosition */

export default function(location) {
  stubLastLocation(location);
  geoPosition.getCurrentPosition = function(success, failure) {
    if (location) {
      success({ coords: location });
    }
  };
}
