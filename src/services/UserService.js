import request from 'superagent';
import RESTService from './RESTService';
import * as localStorage from '../localStorage';

export function login(username, password) {
  return RESTService.post('/token-auth/')
    .send({
      username: username,
      password: password
    })
    .then(function(res) {
      return res.body;
    });
}
