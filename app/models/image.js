import DS from 'ember-data';
import Locatable from 'chief/mixins/locatable';

export default DS.Model.extend(Locatable, {
  spot: DS.belongsTo('spot'),
  file: DS.attr('string'),
  original: DS.attr('string'),
  large: DS.attr('string'),
  thumbnail: DS.attr('string'),

  thumbnailOrOriginal: function() {
    return this.get('thumbnail') || this.get('original');
  }.property('thumbnail', 'original'),

  largeOrOriginal: function() {
    return this.get('large') || this.get('original');
  }.property('large', 'original'),

  progress: 0,
  barWidth: function() {
    var progress = this.get('progress');

    return 'width: ' + progress + '%;';
  }.property('progress')

});
