import createActions from './createActions';

export default createActions({

  receiveAll(events) {
    return {
      type: 'eventsReceived',
      events
    };
  }
});
