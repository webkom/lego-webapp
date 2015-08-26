import RESTService from './RESTService';

export function findAll() {
  return new Promise((resolve, reject) => {
    RESTService.get('/events')
    .auth('admin', 'testtest')
    .end(function(res) {
      if (!res.ok) return reject(res.body);
      resolve(res.body);
    });
  });
}

export function findById(id) {
  return new Promise((resolve, reject) => {
    RESTService.get('/events/' + id)
    .auth('admin', 'testtest')
    .end(function(res) {
      if (!res.ok) return reject(res.body);
      resolve(res.body);
    });
  });
}
