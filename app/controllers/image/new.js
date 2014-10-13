import Ember from 'ember';

export default Ember.ArrayController.extend({
  uploads: [],

  actions: {
    imageUploaded: function(uploadStatus) {
      var upload = this.store.createRecord('upload', {
        url: uploadStatus.get('url')
      });

      upload.save()
    }
  }
});
