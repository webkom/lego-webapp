var Dispatcher = require('flux').Dispatcher;
var assign = require('object-assign');

/**
 * The Application Dispatcher
 *
 * See Flux App Dispatchers for more info.
 */

module.exports = assign(new Dispatcher(), {

  /**
   * @param {object} action The details of the action including
   * the action's type and additional data coming from the server.
   */
  handleServerAction: function(action) {
    console.log('Server Action: ', action);
    this.dispatch({
      source: 'SERVER_ACTION',
      action: action
    });
  },

  /**
   * @param {object} action The details of the action including
   * the action's type and additional data coming from the view.
   */
  handleViewAction: function(action) {
    console.log('View Action: ', action);
    this.dispatch({
      source: 'VIEW_ACTION',
      action: action
    });
  }
});
