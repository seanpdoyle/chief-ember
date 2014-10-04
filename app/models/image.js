import DS from 'ember-data';
import Locatable from 'chief/mixins/locatable';

export default DS.Model.extend(Locatable, {
  spot: DS.belongsTo('spot'),
  original: DS.attr('string'),
  large: DS.attr('string'),
  thumbnail: DS.attr('string'),

  url: function() {
    return this.get('large') || this.get('original');
  }.property('original', 'large')
});
