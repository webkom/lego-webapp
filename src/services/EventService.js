import { get } from './RESTService';

export function findAll() {
  return get('/events');
}

export function findById(id) {
  return get(`/events/${id}`);
}
