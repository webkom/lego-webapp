import { Events } from './ActionTypes';
import { findAll } from '../services/EventService';

export function fetchAll() {
  return {
    type: Events.FETCH_ALL,
    promise: findAll()
  };
}
