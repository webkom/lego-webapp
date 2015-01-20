'use strict';

var request = require('superagent');
var UserActionCreators = require('../actions/UserActionCreators');
var RESTService = require('./RESTService');

module.exports = {

  login: function(username, password) {
    RESTService.get('/me')
      .auth(username, password)
      .end(function(res) {
        if (!res.ok) {
          console.log('Not OK', res);
          UserActionCreators.failedLogin();
          return;
        }
        var userInfo = res.body;
        UserActionCreators.receiveUserInfo(userInfo);
      });
  },
};
