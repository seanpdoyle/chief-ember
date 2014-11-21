export function initialize(_, application) {
  application.inject('route', 'userLocation', 'service:user-location');
  application.inject('controller', 'userLocation', 'service:user-location');
  application.inject('component', 'userLocation', 'service:user-location');
}

export default {
  name: 'user-location',
  initialize: initialize
};
