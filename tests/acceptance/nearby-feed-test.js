import { module, test } from 'ember-qunit';
import Ember from 'ember';
import startApp from 'chief/tests/helpers/start-app';
import stubApi from 'chief/tests/helpers/stub-api';
/* global geoPosition */

var App,
    server;


module('Integration - Nearby Feed', {
  beforeEach: function() {
    App = startApp();
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
    if (server != null) {
      server.shutdown();
    }
  }
});

test('Nearby feed has Nearby spots', function(assert) {
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

  visit('/?latitude=12&longitude=34');

  andThen(function() {
    assert.equal('This is Nearby', find('[data-role=name]').text());
    assert.equal('image.jpg', find('[data-role=image]').attr('src'));
  });
});
