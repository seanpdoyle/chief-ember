import Ember from "ember";

export default Ember.ArrayController.extend({
  withLocation: Ember.computed.filterBy('model', 'hasLocation', true),
  withoutLocation: Ember.computed.setDiff('model', 'withLocation')
});
