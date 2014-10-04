
var request = require('superagent');
var UserActionCreators = require('../actions/UserActionCreators');
var RESTService = require('./RESTService');

module.exports = {

  login: function(username, password) {
    RESTService.post('/auth')
      .auth(username, password)
      .end(function(err, res) {
      })
  },
};
