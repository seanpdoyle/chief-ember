import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('image', 'Image', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it uses the original as the URL when nothing else is present', function() {
  var model = this.subject({ original: 'original.jpg' });

  equal(model.get('url'), 'original.jpg');
});

test('it uses the large as the URL when it is present', function() {
  var model = this.subject({ original: 'original.jpg', large: 'large.jpg' });

  equal(model.get('url'), 'large.jpg');
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
