/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp({
  vendorFiles: {
    'handlebars.js': null
  },
  sassOptions: {
    sourceMap: false,
    includePaths: [
      'bower_components/bourbon/dist',
      'bower_components/neat/app/assets/stylesheets'
    ]
  }
});

// Use `app.import` to add additional libraries to the generated
// output files.
app.import(app.bowerDirectory + '/async/lib/async.js');
app.import(app.bowerDirectory + '/ember-cloaking/ember-cloaking.js');
app.import(app.bowerDirectory + '/ember-multiselect.js/ember-multiselect.js');
app.import(app.bowerDirectory + '/ember-uploader/dist/ember-uploader.js');
app.import(app.bowerDirectory + '/jsjpegmeta/jpegmeta.js');
app.import(app.bowerDirectory + '/owl-carousel/owl-carousel/owl.carousel.css');
app.import(app.bowerDirectory + '/owl-carousel/owl-carousel/owl.carousel.js');
app.import(app.bowerDirectory + '/swag/lib/swag.js');
app.import(app.bowerDirectory + '/geolib/dist/geolib.js');

// If you need to use different assets in different
// environments, specify an object as the first parameter. That
// object's keys should be the environment name and the values
// should be the asset to use in that environment.
//
// If the library that you are including contains AMD or ES6
// modules that you would like to import into your application
// please specify an object with the list of modules as keys
// along with the exports of each module as its value.

module.exports = app.toTree();
