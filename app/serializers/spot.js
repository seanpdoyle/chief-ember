import DS from 'ember-data';

export default DS.ActiveModelSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    images: { serialize: 'ids' },
    distance: { serialize: false }
  }
});
