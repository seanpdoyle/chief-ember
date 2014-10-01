import Ember from 'ember';
import startApp from 'chief/tests/helpers/start-app';
import Pretender from 'pretender';

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

test("Nearby feed has Nearby spots", function() {
  server = new Pretender(function() {
    this.get('/api/spots', function(req) {
      var json = {
        spots: [{ id: 1, name: 'This is Nearby', image: 'image.jpg' }]
      };
      return [200, {'Content-Type': 'application/json'}, JSON.stringify(json)];
    });
  });

  visit('/');

  andThen(function() {
    equal('This is Nearby', find('[data-role=name]').text());
    equal('image.jpg', find('[data-role=image]').attr('src'));
  });
});
