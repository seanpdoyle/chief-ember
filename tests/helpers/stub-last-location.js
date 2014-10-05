/* global localStorage */

export default function(location) {
  localStorage.setItem('lastLocation', JSON.stringify(location));
}
