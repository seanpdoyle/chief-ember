import Ember from 'ember';
import startApp from 'chief/tests/helpers/start-app';
import Pretender from 'pretender';

var App,
    server;

module('Integration - Edit a Spot', {
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

test('Edit a Spot', function() {
  server = new Pretender(function() {
    this.get('/spots/1', function(req) {
      var json = {
        spot: { id: 1, name: 'Old', image_ids: [1] },
        images: [
          { id: 1, spot_id: 1, original: 'old.jpg' },
          { id: 2, original: 'new.jpg' }
        ]
      };
      return [200, {'Content-Type': 'application/json'}, JSON.stringify(json)];
    });

    this.put('/spots/1', function(req) {
      return [200, {'Content-Type': 'application/json'}, ""];
    });
  });

  visit('/spot/1');
  click('a.edit');
  click('[data-image=1]');
  click('[data-image=2]');
  fillIn('input.name', 'New');
  click('button.submit');

  andThen(function() {
    equal(find('[data-role=name]').text(), 'New');
    equal(find('[data-role=image]').attr('src'), 'new.jpg');
  });
});
