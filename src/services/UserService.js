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
      return res.body.token;
    })
    .then(function(token) {
      localStorage.setItem('token', token);
      return RESTService.get('/users/me/')
        .set('Authorization', `JWT ${token}`)
        .then(function(res) {
          res.body.token = token;
          return res.body;
        });
    });
}
