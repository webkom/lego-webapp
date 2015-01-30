'use strict';

/**
 * This thing of beauty is a helper method for use
 * in action creators that require something to be done on the server.
 *
 * Call this method inside an action creator (remember to bind it to the right context)
 * and you get tons of stuff for free. It will call a service method and if
 * the service method success a completed action will be fired. Otherwise a
 * failed action is created.
 *
 * This function assumes that the service methods return promises and that
 * the action creator that initiated the call has the methods
 * `actionName + 'Completed'` and `actionName + 'Failed'`.
 *
 * @param object context *this*
 * @param string actionName
 * @param function serviceMethod
 */

function tryServerAction(context, actionName, serviceMethod, ...args) {
  serviceMethod.apply(serviceMethod, args).then(function(payload) {
    return context[actionName + 'Completed'](payload);
  }).catch(function(error) {
    return context[actionName + 'Failed'](error);
  });
}

module.exports = tryServerAction;
