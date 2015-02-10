import request from 'superagent';
import RESTService from './RESTService';

export default {

  login: function(username, password) {
    return new Promise(function(resolve, reject) {
      RESTService.get('/me')
        .auth(username, password)
        .end(function(err, res) {
          if (err || !res.ok) return reject(res.body);
          return resolve(res.body);
        });
    });
  }
};
