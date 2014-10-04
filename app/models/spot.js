import DS from 'ember-data';
import Locatable from 'chief/mixins/locatable';

export default DS.Model.extend(Locatable, {
  name: DS.attr('string'),
  images: DS.hasMany('image')
});
