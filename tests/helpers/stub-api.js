import Ember from 'ember';
import Pretender from 'pretender';

export default function(httpMethod, url, response) {
  var server = new Pretender(function() {
    this[httpMethod].call(this, url, function(req) {
      return [
        200,
        {},
        typeof(response) === 'function' ?
          response(req) :
          response || {}
      ];
    });
  });

  server.prepareBody = function(body) {
    return JSON.stringify(body || {});
  };

  server.prepareHeaders = function(headers) {
    headers['content-type'] = 'application/json';
    return headers;
  };
}
