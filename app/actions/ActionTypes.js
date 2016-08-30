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
