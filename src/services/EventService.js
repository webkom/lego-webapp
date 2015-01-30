'use strict';

var request = require('superagent');
var EventActionCreators = require('../actions/EventActionCreators');
var RESTService = require('./RESTService');

module.exports = {

  findAll: function(fn) {
    RESTService.get('/events')
      .auth('admin', 'testtest')
      .end(function(res) {
        if (!res.ok) return fn(res.body);
        return fn(null, res.body);
      });
  },

  findById: function(id, fn) {
    RESTService.get('/events/' + id)
      .auth('admin', 'testtest')
      .end(function(res) {
        if (!res.ok) return fn(res.body);
        return fn(null, res.body);
      });
  }
};
