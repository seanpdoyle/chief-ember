import Ember from 'ember';
import startApp from 'chief/tests/helpers/start-app';
import Pretender from 'pretender';

var App,
    server;

module('Integration - Create Spot', {
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
      var spot = json.spot;

      if (Ember.isEmpty(spot.image_ids) || Ember.isEmpty(spot.name)) {
        return [422, {'Content-Type': 'application/json'}, "{}"];
      } else {
        spot.id = 1;
        json.images = spot.image_ids.map(function(id) {
          return { id: id, original: 'image.jpg', spot_id: spot.id };
        });

        return [201, {'Content-Type': 'application/json'}, JSON.stringify(json)];
      }
    });
  });

  visit('/spot/new');
  click('[data-image=1]');
  fillIn('input.name', 'New Spot');
  click('input[type=submit]');

  andThen(function() {
    equal(find('[data-role=name]').text(), 'New Spot');
    equal(find('[data-role=image]').attr('src'), 'image.jpg');
  });
});
