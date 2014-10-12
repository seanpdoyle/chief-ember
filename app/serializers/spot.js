import DS from 'ember-data';

export default DS.ActiveModelSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    bearing: { serialize: false },
    distance: { serialize: false },
    images: { serialize: 'ids' }
  }
});
