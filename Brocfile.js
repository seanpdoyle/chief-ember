/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp({
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

app.import('bower_components/ember-cloaking/ember-cloaking.js');
app.import('bower_components/jsjpegmeta/jpegmeta.js');
app.import('bower_components/ember-uploader/dist/ember-uploader.js');
app.import('bower_components/ember-multiselect.js/ember-multiselect.js');

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
