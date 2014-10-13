import Ember from 'ember';

export default Ember.ArrayController.extend({
  uploads: [],

  actions: {
    imageUploaded: function(upload) {
      var images = this.get('model');
      var image = this.store.createRecord('image', {
        file: upload.get('url')
      });

      image.save().then(function() {
        upload.set('image', image);
        images.pushObject(image);
      }).catch(function(error) {
        image.deleteRecord();
        upload.set('image', null);
        upload.set('failed', true);
        upload.set('error', error.statusText);
      });
    }
  }
});
