'use strict';

var request = require('superagent');
var EventActionCreators = require('../actions/EventActionCreators');
var RESTService = require('./RESTService');

module.exports = {

  getAllEvents: function() {
    RESTService.get('/events')
      .auth('admin', 'testtest')
      .end(function(res) {
        var events = res.body;
        EventActionCreators.receiveAll(events);
      });
  }
};
