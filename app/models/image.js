import DS from 'ember-data';
import Locatable from 'chief/mixins/locatable';

export default DS.Model.extend(Locatable, {
  spot: DS.belongsTo('spot'),
  file: DS.attr('string'),
  original: DS.attr('string'),
  large: DS.attr('string', function(record) {
    return record.get('original');
  }),
  thumbnail: DS.attr('string', function(record) {
    return record.get('original');
  }),

  progress: 0,
  barWidth: function() {
    var progress = this.get('progress');

    return 'width: ' + progress + '%;';
  }.property('progress')

});
