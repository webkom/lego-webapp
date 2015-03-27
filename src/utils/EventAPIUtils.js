import EventActions from '../actions/EventActions';
import * as EventService from '../services/EventService';

export function findAll() {
  EventService.findAll()
    .then((events) => {
      EventActions.receiveAll(events);
    });
};
