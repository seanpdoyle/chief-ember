import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('spot', 'Spot', {
  // Specify the other units that are required for this test.
  needs: ['model:image']
});

test('it exists', function() {
  var model = this.subject();
  // var store = this.store();
  ok(!!model);
});