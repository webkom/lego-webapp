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
export const Company = {
  FETCH: 'Company.FETCH',
  FETCH_BEGIN: 'Company.FETCH_BEGIN',
  FETCH_SUCCESS: 'Company.FETCH_SUCCESS',
  FETCH_FAILURE: 'Company.FETCH_FAILURE',
  ADD_BEGIN: 'Company.ADD_BEGIN',
  ADD_SUCCESS: 'Company.ADD_SUCCESS',
  ADD_FAILURE: 'Company.ADD_FAILURE',
  EDIT_BEGIN: 'Company.EDIT_BEGIN',
  EDIT_SUCCESS: 'Company.EDIT_SUCCESS',
  EDIT_FAILURE: 'Company.EDIT_FAILURE',
  EDIT_SEMESTER_BEGIN: 'Company.EDIT_SEMESTER_BEGIN',
  EDIT_SEMESTER_SUCCESS: 'Company.EDIT_SEMESTER_SUCCESS',
  EDIT_SEMESTER_FAILURE: 'Company.EDIT_SEMESTER_FAILURE',
  ADD_SEMESTER_BEGIN: 'Company.ADD_SEMESTER_BEGIN',
  ADD_SEMESTER_SUCCESS: 'Company.ADD_SEMESTER_SUCCESS',
  ADD_SEMESTER_FAILURE: 'Company.ADD_SEMESTER_FAILURE',
  DELETE_SEMESTER_BEGIN: 'Company.DELETE_SEMESTER_BEGIN',
  DELETE_SEMESTER_SUCCESS: 'Company.DELETE_SEMESTER_SUCCESS',
  DELETE_SEMESTER_FAILURE: 'Company.DELETE_SEMESTER_FAILURE'
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
