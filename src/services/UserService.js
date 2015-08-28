import RESTService from './RESTService';

export function login(username, password) {

}

export function logout() {
  window.localStorage.removeItem('user');
  return Promise.resolve({});
}
