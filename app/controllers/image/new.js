import Ember from 'ember';

export default Ember.ArrayController.extend({
  uploads: [],

  actions: {
    imageUploaded: function(upload) {
      var images = this.get('model');
      var image = this.store.createRecord('image', {
        file: upload.get('url')
      });

      upload.set('image', image);

      image.save().then(function() {
        images.pushObject(image);
      }).catch(function() {
        image.set('failed', true);
      });
    }
  }
});
