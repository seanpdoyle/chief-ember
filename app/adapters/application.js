import DS from 'ember-data';
/* global EmberENV */

export default DS.ActiveModelAdapter.extend({
  host: EmberENV.APP.API_HOST
});
