import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('image', 'Image', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it has a location', function() {
  var model = this.subject({ latitude: 10, longitude: 15 });
  var latitude = model.get('location.latitude');
  var longitude = model.get('location.longitude');

  equal(latitude, 10);
  equal(longitude, 15);
});

test('it exists', function() {
  var model = this.subject();
  // var store = this.store();
  ok(!!model);
});
