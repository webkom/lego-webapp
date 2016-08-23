function generateStatuses(name) {
  return {
    'BEGIN': `${name}.BEGIN`,
    'SUCCESS': `${name}.SUCCESS`,
    'FAILURE': `${name}.FAILURE`
  };
}

/**
 *
 */
export const Event = {
  FETCH: generateStatuses('Event.FETCH')
};

/**
 *
 */
export const Group = {
  FETCH: generateStatuses('Group.FETCH'),
  UPDATE: generateStatuses('Group.UPDATE')
};

/**
 *
 */
export const Favorite = {
  FETCH_ALL: generateStatuses('Favorite.FETCH_ALL')
};

/**
 *
 */
export const Comment = {
  FETCH: generateStatuses('Comment.FETCH'),
  ADD: generateStatuses('Comment.ADD')
};

/**
 *
 */
export const Bdb = {
  FETCH: 'Bdb.FETCH',
  FETCH_BEGIN: 'Bdb.FETCH_BEGIN',
  FETCH_SUCCESS: 'Bdb.FETCH_SUCCESS',
  FETCH_FAILURE: 'Bdb.FETCH_FAILURE',
  ADD_BEGIN: 'Bdb.ADD_BEGIN',
  ADD_SUCCESS: 'Bdb.ADD_SUCCESS',
  ADD_FAILURE: 'Bdb.ADD_FAILURE',
  EDIT_BEGIN: 'Bdb.EDIT_BEGIN',
  EDIT_SUCCESS: 'Bdb.EDIT_SUCCESS',
  EDIT_FAILURE: 'Bdb.EDIT_FAILURE'
};

/**
 *
 */
export const Quote = {
  FETCH: generateStatuses('Quote.FETCH'),
  FETCH_ALL_APPROVED: generateStatuses('Quote.FETCH_ALL_APPROVED'),
  FETCH_ALL_UNAPPROVED: generateStatuses('Quote.FETCH_ALL_UNAPPROVED'),
  LIKE: generateStatuses('Quote.LIKE'),
  UNLIKE: generateStatuses('Quote.UNLIKE'),
  APPROVE: generateStatuses('Quote.APPROVE'),
  UNAPPROVE: generateStatuses('Quote.UNAPPROVE'),
  DELETE: generateStatuses('Quote.DELETE'),
  ADD: generateStatuses('Quote.ADD')
};

/**
 *
 */
export const Search = {
  SEARCH: generateStatuses('Search.SEARCH'),
  RESULTS_RECEIVED: 'Search.RESULTS_RECEIVED',
  TOGGLE_OPEN: 'Search.TOGGLE_OPEN'
};

export const Notifications = {
  NOTIFICATION_ADDED: 'Notification.ADDED',
  NOTIFICATION_REMOVED: 'Notification.REMOVED'
};

/**
 *
 */
export const User = {
  FETCH: generateStatuses('User.FETCH'),
  UPDATE: generateStatuses('User.UPDATE'),
  LOGIN: generateStatuses('User.LOGIN'),
  LOGOUT: 'User.LOGOUT'
};
