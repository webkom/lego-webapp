import request from 'superagent';
import EventActions from '../actions/EventActions';
import RESTService from './RESTService';

export function findAll(fn) {
  return RESTService
    .get('/events/')
    .then(function(res) {
      return res.body;
    });
}

export function findById(id, fn) {
  return RESTService
    .get(`/events/${id}/`)
    .then(function(res) {
      return res.body;
    });
}
