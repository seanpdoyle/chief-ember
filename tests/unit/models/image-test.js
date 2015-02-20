import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('image', 'Image', {
  // Specify the other units that are required for this test.
  needs: ['model:spot']
});

test('it uses the original as the large when nothing else is present', function(assert) {
  var model = this.subject({ original: 'original.jpg' });

  assert.equal(model.get('large'), 'original.jpg');
});

test('it uses the original as the thumbnail when it is missing', function(assert) {
  var model = this.subject({ original: 'original.jpg' });

  assert.equal(model.get('thumbnail'), 'original.jpg');
});

test('it has a location', function(assert) {
  var model = this.subject({ latitude: 10, longitude: 15 });
  var latitude = model.get('location.latitude');
  var longitude = model.get('location.longitude');

  assert.equal(latitude, 10);
  assert.equal(longitude, 15);
});

test('it hasLocation when it has a location', function(assert) {
  var model = this.subject({ latitude: 10, longitude: 15 });

  assert.ok(model.get('hasLocation'));
  assert.ok(!model.get('missingLocation'));
});

test('it is missingLocation when it is missing a location', function(assert) {
  var model = this.subject();

  assert.ok(!model.get('hasLocation'));
  assert.ok(model.get('missingLocation'));
});
