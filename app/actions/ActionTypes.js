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
  PAYMENT: generateStatuses('Event.PAYMENT'),
  SOCKET_REGISTRATION: 'SOCKET_REGISTRATION',
  SOCKET_UNREGISTRATION: 'SOCKET_UNREGISTRATION'
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
  MENTION: generateStatuses('Search.MENTION'),
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
  FETCH: generateStatuses('Page.Fetch')
};
