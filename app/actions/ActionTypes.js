// @flow

function generateStatuses(name) {
  return {
    BEGIN: `${name}.BEGIN`,
    SUCCESS: `${name}.SUCCESS`,
    FAILURE: `${name}.FAILURE`
  };
}

/**
 *
 */
export const Event = {
  FETCH: generateStatuses('Event.FETCH'),
  CREATE: generateStatuses('Event.CREATE'),
  EDIT: generateStatuses('Event.EDIT'),
  DELETE: generateStatuses('Event.DELETE'),
  ADMINISTRATE_FETCH: generateStatuses('Event.ADMINISTRATE_FETCH'),
  REGISTER: generateStatuses('Event.REGISTER'),
  ADMIN_REGISTER: generateStatuses('Event.ADMIN_REGISTER'),
  UNREGISTER: generateStatuses('Event.UNREGISTER'),
  PAYMENT_QUEUE: generateStatuses('Event.PAYMENT_QUEUE'),
  UPDATE_REGISTRATION: generateStatuses('Event.UPDATE_REGISTRATION'),
  SOCKET_REGISTRATION: generateStatuses('Event.SOCKET_REGISTRATION'),
  SOCKET_UNREGISTRATION: generateStatuses('Event.SOCKET_UNREGISTRATION'),
  SOCKET_PAYMENT: generateStatuses('Event.SOCKET_PAYMENT'),
  SOCKET_EVENT_UPDATED: 'SOCKET_EVENT_UPDATED'
};

/**
 *
 */
export const Article = {
  FETCH: generateStatuses('Article.FETCH'),
  CREATE: generateStatuses('Article.CREATE'),
  EDIT: generateStatuses('Article.EDIT')
};
/**
 *
 */
export const Joblistings = {
  FETCH: generateStatuses('Joblistings.FETCH'),
  CREATE: generateStatuses('Joblistings.CREATE'),
  EDIT: generateStatuses('Joblistings.EDIT'),
  DELETE: generateStatuses('Joblistings.DELETE')
};

/**
 *
 */
export const Meeting = {
  FETCH: generateStatuses('Meeting.FETCH'),
  SET_INVITATION_STATUS: generateStatuses('Meeting.SET_INVITATION_STATUS'),
  CREATE: generateStatuses('Meeting.CREATE'),
  EDIT: generateStatuses('Meeting.EDIT'),
  DELETE: generateStatuses('Meeting.DELETE'),
  ANSWER_INVITATION_TOKEN: generateStatuses('Meeting.ANSWER_INVITATION_TOKEN')
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
  FETCH: generateStatuses('Company.FETCH'),
  ADD: generateStatuses('Company.ADD'),
  EDIT: generateStatuses('Company.EDIT'),
  DELETE: generateStatuses('Company.DELETE'),
  ADD_SEMESTER: generateStatuses('Company.ADD_SEMESTER'),
  EDIT_SEMESTER: generateStatuses('Company.EDIT_SEMESTER'),
  DELETE_SEMESTER: generateStatuses('Company.DELETE_SEMESTER'),
  ADD_COMPANY_CONTACT: generateStatuses('Company.ADD_COMPANY_CONTACT'),
  EDIT_COMPANY_CONTACT: generateStatuses('Company.EDIT_COMPANY_CONTACT'),
  DELETE_COMPANY_CONTACT: generateStatuses('Company.DELETE_COMPANY_CONTACT')
};

/**
 *
 */
export const Quote = {
  FETCH: generateStatuses('Quote.FETCH'),
  FETCH_ALL_APPROVED: generateStatuses('Quote.FETCH_ALL_APPROVED'),
  FETCH_ALL_UNAPPROVED: generateStatuses('Quote.FETCH_ALL_UNAPPROVED'),
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

export const NotificationsFeed = {
  FETCH_DATA: generateStatuses('NotificationsFeed.FETCH_DATA'),
  MARK_ALL: generateStatuses('NotificationsFeed.MARK_ALL'),
  MARK: generateStatuses('NotificationsFeed.MARK')
};

/**
 *
 */
export const User = {
  FETCH: generateStatuses('User.FETCH'),
  UPDATE: generateStatuses('User.UPDATE'),
  LOGIN: generateStatuses('User.LOGIN'),
  LOGOUT: 'User.LOGOUT',
  SOCKET: generateStatuses('User.SOCKET'),
  SEND_REGISTRATION_TOKEN: generateStatuses('User.SEND_REGISTRATION_TOKEN')
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

/**
 *
 */
export const Routing = {
  SET_STATUS_CODE: 'Routing.SET_STATUS_CODE'
};

/**
 *
 */
export const OAuth2 = {
  FETCH_APPLICATIONS: generateStatuses('OAuth2.FETCH_APPLICATIONS'),
  FETCH_APPLICATION: generateStatuses('OAuth2.FETCH_APPLICATION'),
  UPDATE_APPLICATION: generateStatuses('OAuth2.UPDATE_APPLICATION'),
  CREATE_APPLICATION: generateStatuses('OAuth2.CREATE_APPLICATION'),
  FETCH_GRANTS: generateStatuses('OAuth2.FETCH_GRANTS'),
  DELETE_GRANT: generateStatuses('OAuth2.DELETE_GRANT')
};

/**
 *
 */
export const NotificationSettings = {
  FETCH_ALTERNATIVES: generateStatuses(
    'NotificationSettings.FETCH_ALTERNATIVES'
  ),
  FETCH: generateStatuses('NotificationSettings.FETCH'),
  UPDATE: generateStatuses('NotificationSettings.UPDATE')
};
