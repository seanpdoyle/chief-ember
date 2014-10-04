import Ember from 'ember';
import startApp from 'chief/tests/helpers/start-app';
import Pretender from 'pretender';

var App,
    server;

module('Integration - Unused Images', {
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

test('Images display all Images as thumbnails', function() {
  server = new Pretender(function() {
    this.get('/images', function(req) {
      var json = {
        images: [{ id: 1, thumbnail: 'image.jpg' }]
      };
      return [200, {'Content-Type': 'application/json'}, JSON.stringify(json)];
    });
  });

  visit('/images');

  andThen(function() {
    equal(find('[data-role=thumbnail]').attr('src'), 'image.jpg');
  });
});
