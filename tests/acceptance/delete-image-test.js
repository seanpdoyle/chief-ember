import Ember from 'ember';
import startApp from 'chief/tests/helpers/start-app';
import Pretender from 'pretender';

var App,
    server;

module('Integration - Delete Image', {
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

test('Delete an image from images list', function() {
  server = new Pretender(function() {
    this.get('/images', function(req) {
      var json = {
        images: [{ id: 1, original: 'image.jpg' }]
      };
      return [200, {'Content-Type': 'application/json'}, JSON.stringify(json)];
    });

    this.delete('/images/1', function(req) {
      return [200, {'Content-Type': 'application/json'}, ""];
    });
  });

  visit('/spot/new');
  click('[data-destroy-image=1]');

  andThen(function() {
    ok(!find('[data-role=image]').length);
  });
});
