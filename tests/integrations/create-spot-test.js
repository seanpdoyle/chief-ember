import Ember from 'ember';
import startApp from 'chief/tests/helpers/start-app';
import stubGeolocation from 'chief/tests/helpers/stub-geolocation';
import Pretender from 'pretender';

var App,
    server;

module('Integration - Create Spot', {
  setup: function() {
    App = startApp();
    stubGeolocation({latitude: 0, longitude: 0});
  },
  teardown: function() {
    Ember.run(App, 'destroy');
    if (server != null) {
      server.shutdown();
    }
  }
});

test('Create a Spot from an Image', function() {
  server = new Pretender(function() {
    this.get('/images', function(req) {
      var json = {
        images: [{ id: 1, original: 'image.jpg' }]
      };
      return [200, {'Content-Type': 'application/json'}, JSON.stringify(json)];
    });

    this.post('/spots', function(req) {
      var json = JSON.parse(req.requestBody);
      json.spot.id = 1;

      return [201, {'Content-Type': 'application/json'}, JSON.stringify(json)];
    });
  });

  visit('/spot/new');
  click('[data-image=1]');
  fillIn('input.name', 'New Spot');
  click('button.submit');

  andThen(function() {
    equal(find('[data-role=name]').text(), 'New Spot');
    equal(find('[data-role=image]').attr('src'), 'image.jpg');
  });
});
