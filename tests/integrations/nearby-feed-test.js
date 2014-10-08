import Ember from 'ember';
import startApp from 'chief/tests/helpers/start-app';
import stubLocation from 'chief/tests/helpers/stub-geolocation';
import stubApi from 'chief/tests/helpers/stub-api';

var App,
    server;

module('Integration - Nearby Feed', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
    if (server != null) {
      server.shutdown();
    }
  }
});

test('Nearby feed has Nearby spots', function() {
  stubLocation({latitude: 12, longitude: 34});
  server = stubApi('get', '/spots', function(req) {
    var params = req.queryParams;

    if (params.latitude === "12" && params.longitude === "34") {
      return {
        spots: [{ id: 1, name: 'This is Nearby', image_ids: [1] }],
        images: [{ id: 1, original: 'image.jpg' }]
      };
    } else {
      return { spots: [], images: [] };
    }
  });

  visit('/');

  andThen(function() {
    equal('This is Nearby', find('[data-role=name]').text());
    equal('image.jpg', find('[data-role=image]').attr('src'));
  });
});
