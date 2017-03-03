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
  REGISTER: generateStatuses('Event.REGISTER'),
  UNREGISTER: generateStatuses('Event.UNREGISTER'),
  PAYMENT_QUEUE: generateStatuses('Event.PAYMENT_QUEUE'),
  UPDATE_REGISTRATION: generateStatuses('Event.UPDATE_REGISTRATION'),
  SOCKET_REGISTRATION: generateStatuses('Event.SOCKET_REGISTRATION'),
  SOCKET_UNREGISTRATION: generateStatuses('Event.SOCKET_UNREGISTRATION'),
  SOCKET_PAYMENT: generateStatuses('Event.SOCKET_PAYMENT')
};

/**
 *
 */
export const Article = {
  FETCH: generateStatuses('Article.FETCH')
};
/**
 *
 */
export const Joblistings = {
  FETCH: generateStatuses('Joblistings.FETCH')
};

/**
 *
 */
export const Meeting = {
  FETCH: generateStatuses('Meeting.FETCH'),
  SET_INVITATION_STATUS: generateStatuses('Meeting.SET_INVITATION_STATUS'),
  CREATE: generateStatuses('Meeting.CREATE'),
  EDIT: generateStatuses('Meeting.EDIT')
};

/**
 *
 */
export const Group = {
  FETCH: generateStatuses('Group.FETCH'),
  UPDATE: generateStatuses('Group.UPDATE')
};

export const InterestGroup = {
  FETCH_ALL: generateStatuses('InterestGroup.FETCH_ALL'),
  FETCH: generateStatuses('InterestGroup.FETCH'),
  CREATE: generateStatuses('InterestGroup.CREATE'),
  REMOVE: generateStatuses('InterestGroup.REMOVE'),
  UPDATE: generateStatuses('InterestGroup.UPDATE')
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
  AUTOCOMPLETE: generateStatuses('Search.AUTOCOMPLETE'),
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
  LOGOUT: 'User.LOGOUT',
  SOCKET: generateStatuses('User.SOCKET')
};

/**
 *
 */
export const Page = {
  FETCH: generateStatuses('Page.FETCH'),
  UPDATE: generateStatuses('Page.UPDATE')
};

/**
 *
 */
export const Bdb = {
  FETCH: generateStatuses('Bdb.FETCH')
};

/**
 *
 */
export const File = {
  FETCH_SIGNED_POST: generateStatuses('File.FETCH_SIGNED_POST'),
  UPLOAD: generateStatuses('File.UPLOAD')
};

/**
 *
 */
export const Feed = {
  FETCH: generateStatuses('Feed.FETCH')
};
