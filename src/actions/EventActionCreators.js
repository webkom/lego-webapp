import Dispatcher from 'lego-flux/lib/Dispatcher';

export default {

  receiveAll(events) {
    Dispatcher.handleServerAction({
      type: 'RECEIVE_EVENTS',
      events: events
    });
  }
};
