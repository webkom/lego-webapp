'use strict';

var request = require('superagent');
var RESTService = require('./RESTService');

module.exports = {

  login: function(username, password, fn) {
    RESTService.get('/me')
      .auth(username, password)
      .end(function(err, res) {
        if (err || !res.ok) return fn(res.body);
        return fn(null, res.body);
      });
  },

  getToken: function() {
  	return localStorage.token || 'CRASHOVERRIDE';
  },

  logout: function(fn) {
  	delete localStorage.token;
  	fn && fn();
  },

  loggedIn: function() {
  	return !!localStorage.token;
  }
};
