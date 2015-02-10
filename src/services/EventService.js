import request from 'superagent';
import EventActionCreators from '../actions/EventActionCreators';
import RESTService from './RESTService';

export function findAll(fn) {
  RESTService.get('/events')
    .auth('admin', 'testtest')
    .end(function(res) {
      if (!res.ok) return fn(res.body);
      return fn(null, res.body);
    });
}

export function findById(id, fn) {
  RESTService.get('/events/' + id)
    .auth('admin', 'testtest')
    .end(function(res) {
      if (!res.ok) return fn(res.body);
      return fn(null, res.body);
    });
}
