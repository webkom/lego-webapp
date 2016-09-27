export type Action = {
  type: string;
  payload: any;
  meta?: any;
  error: boolean;
};

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
  FETCH: generateStatuses('Event.FETCH'),
  FETCH_BEGIN: 'Event.FETCH_BEGIN',
  FETCH_SUCCESS: 'Event.FETCH_SUCCESS',
  FETCH_FAILURE: 'Event.FETCH_FAILURE'
};

/**
 *
 */
export const Group = {
  FETCH: generateStatuses('Group.FETCH'),
  FETCH_BEGIN: 'Group.FETCH_BEGIN',
  FETCH_SUCCESS: 'Group.FETCH_SUCCESS',
  FETCH_FAILURE: 'Group.FETCH_FAILURE',
  FETCH_ALL: generateStatuses('Group.FETCH_ALL'),
  FETCH_ALL_BEGIN: 'Group.FETCH_ALL_BEGIN',
  FETCH_ALL_SUCCESS: 'Group.FETCH_ALL_SUCCESS',
  FETCH_ALL_FAILURE: 'Group.FETCH_ALL_FAILURE',
  UPDATE: generateStatuses('Group.UPDATE'),
  UPDATE_BEGIN: 'Group.UPDATE_BEGIN',
  UPDATE_SUCCESS: 'Group.UPDATE_SUCCESS',
  UPDATE_FAILURE: 'Group.UPDATE_FAILURE'
};

/**
 *
 */
export const Favorite = {
  FETCH_ALL: generateStatuses('Favotire.FETCH_ALL'),
  FETCH_ALL_SUCCESS: 'Favorite.FETCH_ALL_SUCCESS'
};

/**
 *
 */
export const Comment = {
  ADD: generateStatuses('Comment.ADD'),
  ADD_BEGIN: 'Comment.ADD_BEGIN',
  ADD_SUCCESS: 'Comment.ADD_SUCCESS',
  ADD_FAILURE: 'Comment.ADD_FAILURE'
};

/**
 *
 */
export const Quote = {
  FETCH: generateStatuses('Quote.FETCH'),
  FETCH_BEGIN: 'Quote.FETCH_BEGIN',
  FETCH_SUCCESS: 'Quote.FETCH_SUCCESS',
  FETCH_FAILURE: 'Quote.FETCH_FAILURE',
  FETCH_ALL_APPROVED: generateStatuses('Quote.FETCH_ALL_APPROVED'),
  FETCH_ALL_APPROVED_BEGIN: 'Quote.FETCH_ALL_APPROVED_BEGIN',
  FETCH_ALL_APPROVED_SUCCESS: 'Quote.FETCH_ALL_APPROVED_SUCCESS',
  FETCH_ALL_APPROVED_FAILURE: 'Quote.FETCH_ALL_APPROVED_FAILURE',
  FETCH_ALL_UNAPPROVED: generateStatuses('Quote.FETCH_ALL_UNAPPROVED'),
  FETCH_ALL_UNAPPROVED_BEGIN: 'Quote.FETCH_ALL_UNAPPROVED_BEGIN',
  FETCH_ALL_UNAPPROVED_SUCCESS: 'Quote.FETCH_ALL_UNAPPROVED_SUCCESS',
  FETCH_ALL_UNAPPROVED_FAILURE: 'Quote.FETCH_ALL_UNAPPROVED_FAILURE',
  LIKE: generateStatuses('Quote.LIKE'),
  LIKE_BEGIN: 'Quote.LIKE_BEGIN',
  LIKE_SUCCESS: 'Quote.LIKE_SUCCESS',
  LIKE_FAILURE: 'Quote.LIKE_FAILURE',
  UNLIKE: generateStatuses('Quote.UNLIKE'),
  UNLIKE_BEGIN: 'Quote.UNLIKE_BEGIN',
  UNLIKE_SUCCESS: 'Quote.UNLIKE_SUCCESS',
  UNLIKE_FAILURE: 'Quote.UNLIKE_FAILURE',
  APPROVE: generateStatuses('Quote.APPROVE'),
  APPROVE_BEGIN: 'Quote.APPROVE_BEGIN',
  APPROVE_SUCCESS: 'Quote.APPROVE_SUCCESS',
  APPROVE_FAILURE: 'Quote.APPROVE_FAILURE',
  UNAPPROVE: generateStatuses('Quote.UNAPPROVE'),
  UNAPPROVE_BEGIN: 'Quote.UNAPPROVE_BEGIN',
  UNAPPROVE_SUCCESS: 'Quote.UNAPPROVE_SUCCESS',
  UNAPPROVE_FAILURE: 'Quote.UNAPPROVE_FAILURE',
  DELETE: generateStatuses('Quote.DELETE'),
  DELETE_BEGIN: 'Quote.DELETE_BEGIN',
  DELETE_SUCCESS: 'Quote.DELETE_SUCCESS',
  DELETE_FAILURE: 'Quote.DELETE_FAILURE',
  ADD: generateStatuses('Quote.ADD'),
  ADD_BEGIN: 'Quote.ADD_BEGIN',
  ADD_SUCCESS: 'Quote.ADD_SUCCESS',
  ADD_FAILURE: 'Quote.ADD_FAILURE'
};

/**
 *
 */
export const Search = {
  SEARCH: generateStatuses('Search.SEARCH'),
  SEARCH_BEGIN: 'Search.SEARCH_BEGIN',
  SEARCH_FAILURE: 'Search.SEARCH_FAILURE',
  SEARCH_SUCCESS: 'Search.SEARCH_SUCCESS',
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
  FETCH_BEGIN: 'User.FETCH_BEGIN',
  FETCH_SUCCESS: 'User.FETCH_SUCCESS',
  FETCH_FAILURE: 'User.FETCH_FAILURE',
  UPDATE: generateStatuses('User.UPDATE'),
  UPDATE_BEGIN: 'User.UPDATE_BEGIN',
  UPDATE_SUCCESS: 'User.UPDATE_SUCCESS',
  UPDATE_FAILURE: 'User.UPDATE_FAILURE',
  LOGIN: generateStatuses('User.LOGIN'),
  LOGIN_BEGIN: 'User.LOGIN_BEGIN',
  LOGIN_SUCCESS: 'User.LOGIN_SUCCESS',
  LOGIN_FAILURE: 'User.LOGIN_FAILURE',
  LOGOUT: 'User.LOGOUT'
};
