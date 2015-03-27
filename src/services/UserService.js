import RESTService from './RESTService';

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

export function tokenLogin(token) {
  return RESTService.post('/token-auth/refresh/')
    .send({
      token: token
    })
    .then(function(res) {
      return res.body;
    });
}
