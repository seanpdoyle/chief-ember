import DS from 'ember-data';

export default DS.ActiveModelSerializer.extend({
  attrs: {
    distance: { serialize: false },
    original: { serialize: false },
    large: { serialize: false },
    thumbnail: { serialize: false }
  }
});
