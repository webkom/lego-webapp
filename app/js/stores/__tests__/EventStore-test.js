jest.dontMock('../EventStore');
jest.dontMock('../Store');
jest.dontMock('object-assign');

describe('EventStore', function() {

  var AppDispatcher;
  var EventStore;
  var callback;

  beforeEach(function() {
    AppDispatcher = require('../../AppDispatcher');
    EventStore = require('../EventStore');
    callback = AppDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', function() {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });

  it('initializes with no events', function() {
    expect(EventStore.getAll()).toEqual({});
  });
});