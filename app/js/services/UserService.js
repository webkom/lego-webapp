
var request = require('superagent');
var UserServerActionCreators = require('../actions/UserServerActionCreators');
var RESTService = require('./RESTService');

module.exports = {

  login: function(username, password) {
    RESTService.get('/me')
      .auth(username, password)
      .end(function(res) {
        if (!res.ok) {
          console.log('Not OK', res);
          UserServerActionCreators.failedLogin();
          return;
        }
        var userInfo = res.body;
        UserServerActionCreators.receiveUserInfo(userInfo);
      });
  },
};
