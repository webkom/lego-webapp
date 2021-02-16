// @flow
import type { AsyncActionType } from 'app/types';
const generateStatuses = (name: string): AsyncActionType => ({
  BEGIN: `${name}.BEGIN`,
  SUCCESS: `${name}.SUCCESS`,
  FAILURE: `${name}.FAILURE`,
});

// Create shorthand to make code format cleaner
type AAT = AsyncActionType;

/**
 *
 */
export const Event = {
  CLEAR: 'Event.CLEAR',
  FETCH: (generateStatuses('Event.FETCH'): AAT),
  FETCH_PREVIOUS: (generateStatuses('Event.FETCH_PREVIOUS'): AAT),
  FETCH_UPCOMING: (generateStatuses('Event.FETCH_UPCOMING'): AAT),
  CREATE: (generateStatuses('Event.CREATE'): AAT),
  EDIT: (generateStatuses('Event.EDIT'): AAT),
  DELETE: (generateStatuses('Event.DELETE'): AAT),
  ADMINISTRATE_FETCH: (generateStatuses('Event.ADMINISTRATE_FETCH'): AAT),
  REQUEST_REGISTER: (generateStatuses('Event.REQUEST_REGISTER'): AAT),
  ADMIN_REGISTER: (generateStatuses('Event.ADMIN_REGISTER'): AAT),
  REQUEST_UNREGISTER: (generateStatuses('Event.REQUEST_UNREGISTER'): AAT),
  PAYMENT_QUEUE: (generateStatuses('Event.PAYMENT_QUEUE'): AAT),
  UPDATE_REGISTRATION: (generateStatuses('Event.UPDATE_REGISTRATION'): AAT),
  SOCKET_REGISTRATION: (generateStatuses('Event.SOCKET_REGISTRATION'): AAT),
  SOCKET_UNREGISTRATION: (generateStatuses('Event.SOCKET_UNREGISTRATION'): AAT),
  SOCKET_PAYMENT: (generateStatuses('Event.SOCKET_PAYMENT'): AAT),
  SOCKET_INITIATE_PAYMENT: (generateStatuses(
    'Event.SOCKET_INITIATE_PAYMENT'
  ): AAT),
  SOCKET_EVENT_UPDATED: 'SOCKET_EVENT_UPDATED',
  FOLLOW: (generateStatuses('Event.FOLLOW'): AAT),
  UNFOLLOW: (generateStatuses('Event.UNFOLLOW'): AAT),
  IS_USER_FOLLOWING: (generateStatuses('Event.IS_USER_FOLLOWING'): AAT),
};

/**
 *
 */
export const Article = {
  FETCH: (generateStatuses('Article.FETCH'): AAT),
  CREATE: (generateStatuses('Article.CREATE'): AAT),
  EDIT: (generateStatuses('Article.EDIT'): AAT),
  DELETE: (generateStatuses('Article.DELETE'): AAT),
};

/**
 *
 */
export const EmailList = {
  FETCH: (generateStatuses('EmailList.FETCH'): AAT),
  CREATE: (generateStatuses('EmailList.CREATE'): AAT),
  EDIT: (generateStatuses('EmailList.EDIT'): AAT),
};

/**
 *
 */
export const RestrictedMail = {
  FETCH: (generateStatuses('RestrictedMail.FETCH'): AAT),
  CREATE: (generateStatuses('RestrictedMail.CREATE'): AAT),
  EDIT: (generateStatuses('RestrictedMail.EDIT'): AAT),
};

/**
 *
 */
export const EmailUser = {
  FETCH: (generateStatuses('EmailUser.FETCH'): AAT),
  CREATE: (generateStatuses('EmailUser.CREATE'): AAT),
  EDIT: (generateStatuses('EmailUser.EDIT'): AAT),
};

/**
 *
 */
export const Gallery = {
  FETCH: (generateStatuses('Gallery.FETCH'): AAT),
  CREATE: (generateStatuses('Gallery.CREATE'): AAT),
  EDIT: (generateStatuses('Gallery.EDIT'): AAT),
  UPLOAD: (generateStatuses('Gallery.UPLOAD'): AAT),
  DELETE: (generateStatuses('Gallery.DELETE'): AAT),
  HIDE_UPLOAD_STATUS: 'Gallery.HIDE_UPLOAD_STATUS',
};

/**
 *
 */
export const GalleryPicture = {
  FETCH: (generateStatuses('GalleryPicture.FETCH'): AAT),
  FETCH_SIBLING: (generateStatuses('GalleryPicture.FETCH_SIBLING'): AAT),
  CREATE: (generateStatuses('GalleryPicture.CREATE'): AAT),
  EDIT: (generateStatuses('GalleryPicture.EDIT'): AAT),
  DELETE: (generateStatuses('GalleryPicture.DELETE'): AAT),
  UPLOAD: (generateStatuses('GalleryPicture.UPLOAD'): AAT),
};

/**
 *
 */
export const Joblistings = {
  FETCH: (generateStatuses('Joblistings.FETCH'): AAT),
  CREATE: (generateStatuses('Joblistings.CREATE'): AAT),
  EDIT: (generateStatuses('Joblistings.EDIT'): AAT),
  DELETE: (generateStatuses('Joblistings.DELETE'): AAT),
};
/**
 *
 */
export const Announcements = {
  FETCH_ALL: (generateStatuses('Announcements.FETCH_ALL'): AAT),
  CREATE: (generateStatuses('Announcements.CREATE'): AAT),
  SEND: (generateStatuses('Announcements.SEND'): AAT),
  DELETE: (generateStatuses('Announcements.DELETE'): AAT),
};
/**
 *
 */
export const Meeting = {
  FETCH: (generateStatuses('Meeting.FETCH'): AAT),
  SET_INVITATION_STATUS: (generateStatuses(
    'Meeting.SET_INVITATION_STATUS'
  ): AAT),
  CREATE: (generateStatuses('Meeting.CREATE'): AAT),
  EDIT: (generateStatuses('Meeting.EDIT'): AAT),
  DELETE: (generateStatuses('Meeting.DELETE'): AAT),
  ANSWER_INVITATION_TOKEN: (generateStatuses(
    'Meeting.ANSWER_INVITATION_TOKEN'
  ): AAT),
  RESET_MEETINGS_TOKEN: 'Meeting.RESET_MEETINGS_TOKEN',
};

/**
 *
 */
export const Group = {
  FETCH: (generateStatuses('Group.FETCH'): AAT),
  UPDATE: (generateStatuses('Group.UPDATE'): AAT),
  FETCH_ALL: (generateStatuses('Group.FETCH_ALL'): AAT),
  CREATE: (generateStatuses('Group.CREATE'): AAT),
  REMOVE: (generateStatuses('Group.REMOVE'): AAT),
  MEMBERSHIP_FETCH: (generateStatuses('Group.MEMBERSHIP_FETCH'): AAT),
};

export const CompanyInterestForm = {
  FETCH_ALL: (generateStatuses('CompanyInterestForm.FETCH_ALL'): AAT),
  FETCH: (generateStatuses('CompanyInterestForm.FETCH'): AAT),
  CREATE: (generateStatuses('CompanyInterestForm.CREATE'): AAT),
  DELETE: (generateStatuses('CompanyInterestForm.DELETE'): AAT),
  UPDATE: (generateStatuses('CompanyInterestForm.UPDATE'): AAT),
};

export const Membership = {
  CREATE: (generateStatuses('Membership.CREATE'): AAT),
  REMOVE: (generateStatuses('Membership.REMOVE'): AAT),
  JOIN_GROUP: (generateStatuses('Membership.JOIN_GROUP'): AAT),
  LEAVE_GROUP: (generateStatuses('Membership.LEAVE_GROUP'): AAT),
};

/**
 *
 */
export const Favorite = {
  FETCH_ALL: (generateStatuses('Favorite.FETCH_ALL'): AAT),
};

/**
 *
 */
export const Comment = {
  FETCH: (generateStatuses('Comment.FETCH'): AAT),
  ADD: (generateStatuses('Comment.ADD'): AAT),
  DELETE: (generateStatuses('Comment.DELETE'): AAT),
};

/**
 *
 */
export const Company = {
  FETCH: (generateStatuses('Company.FETCH'): AAT),
  FETCH_COMPANY_CONTACT: (generateStatuses(
    'Company.FETCH_COMPANY_CONTACT'
  ): AAT),
  ADD: (generateStatuses('Company.ADD'): AAT),
  EDIT: (generateStatuses('Company.EDIT'): AAT),
  DELETE: (generateStatuses('Company.DELETE'): AAT),
  ADD_SEMESTER_STATUS: (generateStatuses('Company.ADD_SEMESTER_STATUS'): AAT),
  EDIT_SEMESTER_STATUS: (generateStatuses('Company.EDIT_SEMESTER_STATUS'): AAT),
  DELETE_SEMESTER_STATUS: (generateStatuses(
    'Company.DELETE_SEMESTER_STATUS'
  ): AAT),
  ADD_COMPANY_CONTACT: (generateStatuses('Company.ADD_COMPANY_CONTACT'): AAT),
  EDIT_COMPANY_CONTACT: (generateStatuses('Company.EDIT_COMPANY_CONTACT'): AAT),
  DELETE_COMPANY_CONTACT: (generateStatuses(
    'Company.DELETE_COMPANY_CONTACT'
  ): AAT),
  FETCH_SEMESTERS: (generateStatuses('Company.FETCH_SEMESTERS'): AAT),
  ADD_SEMESTER: (generateStatuses('Company.ADD_SEMESTER'): AAT),
  EDIT_SEMESTER: (generateStatuses('Company.EDIT_SEMESTER'): AAT),
};

/**
 *
 */
export const Quote = {
  FETCH: (generateStatuses('Quote.FETCH'): AAT),
  FETCH_ALL_APPROVED: (generateStatuses('Quote.FETCH_ALL_APPROVED'): AAT),
  FETCH_ALL_UNAPPROVED: (generateStatuses('Quote.FETCH_ALL_UNAPPROVED'): AAT),
  FETCH_RANDOM: (generateStatuses('Quote.FETCH_RANDOM'): AAT),
  APPROVE: (generateStatuses('Quote.APPROVE'): AAT),
  UNAPPROVE: (generateStatuses('Quote.UNAPPROVE'): AAT),
  DELETE: (generateStatuses('Quote.DELETE'): AAT),
  ADD: (generateStatuses('Quote.ADD'): AAT),
};

/**
 *
 */
export const Search = {
  SEARCH: (generateStatuses('Search.SEARCH'): AAT),
  AUTOCOMPLETE: (generateStatuses('Search.AUTOCOMPLETE'): AAT),
  RESULTS_RECEIVED: 'Search.RESULTS_RECEIVED',
  TOGGLE_OPEN: 'Search.TOGGLE_OPEN',
  MENTION: (generateStatuses('Search.MENTION'): AAT),
};

export const Toasts = {
  TOAST_ADDED: 'Toast.ADDED',
  TOAST_REMOVED: 'Toast.REMOVED',
};

export const NotificationsFeed = {
  FETCH_DATA: (generateStatuses('NotificationsFeed.FETCH_DATA'): AAT),
  MARK_ALL: (generateStatuses('NotificationsFeed.MARK_ALL'): AAT),
  MARK: (generateStatuses('NotificationsFeed.MARK'): AAT),
};

/**
 *
 */
export const User = {
  FETCH: (generateStatuses('User.FETCH'): AAT),
  UPDATE: (generateStatuses('User.UPDATE'): AAT),
  PASSWORD_CHANGE: (generateStatuses('User.PASSWORD_CHANGE'): AAT),
  LOGIN: (generateStatuses('User.LOGIN'): AAT),
  LOGOUT: 'User.LOGOUT',
  SOCKET: (generateStatuses('User.SOCKET'): AAT),
  SEND_REGISTRATION_TOKEN: (generateStatuses(
    'User.SEND_REGISTRATION_TOKEN'
  ): AAT),
  VALIDATE_REGISTRATION_TOKEN: (generateStatuses(
    'User.VALIDATE_REGISTRATION_TOKEN'
  ): AAT),
  CREATE_USER: (generateStatuses('User.CREATE_USER'): AAT),
  SEND_STUDENT_CONFIRMATION_TOKEN: (generateStatuses(
    'User.SEND_STUDENT_CONFIRMATION_TOKEN'
  ): AAT),
  CONFIRM_STUDENT_USER: (generateStatuses('User.CONFIRM_STUDENT_USER'): AAT),
  SEND_FORGOT_PASSWORD_REQUEST: (generateStatuses(
    'User.SEND_FORGOT_PASSWORD_REQUEST'
  ): AAT),
  RESET_PASSWORD: (generateStatuses('User.RESET_PASSWORD'): AAT),
  REFRESH_TOKEN: (generateStatuses('User.REFRESH_TOKEN'): AAT),
};

export const Penalty = {
  FETCH: (generateStatuses('Penalty.FETCH'): AAT),
  CREATE: (generateStatuses('Penalty.CREATE'): AAT),
  DELETE: (generateStatuses('Penalty.DELETE'): AAT),
};

/**
 *
 */
export const Page = {
  FETCH: (generateStatuses('Page.FETCH'): AAT),
  CREATE: (generateStatuses('Page.CREATE'): AAT),
  UPDATE: (generateStatuses('Page.UPDATE'): AAT),
  DELETE: (generateStatuses('Page.DELETE'): AAT),
};

/**
 *
 */
export const Bdb = {
  FETCH: (generateStatuses('Bdb.FETCH'): AAT),
};

/**
 *
 */
export const Survey = {
  FETCH: (generateStatuses('Survey.FETCH'): AAT),
  ADD: (generateStatuses('Survey.ADD'): AAT),
  EDIT: (generateStatuses('Survey.EDIT'): AAT),
  SHARE: (generateStatuses('Survey.SHARE'): AAT),
  HIDE: (generateStatuses('Survey.HIDE'): AAT),
};

/**
 *
 */
export const SurveySubmission = {
  FETCH_ALL: (generateStatuses('SurveySubmission.FETCH_ALL'): AAT),
  FETCH: (generateStatuses('SurveySubmission.FETCH'): AAT),
  ADD: (generateStatuses('SurveySubmission.ADD'): AAT),
  DELETE: (generateStatuses('SurveySubmission.DELETE'): AAT),
  HIDE_ANSWER: (generateStatuses('SurveySubmission.HIDE_ANSWER'): AAT),
  SHOW_ANSWER: (generateStatuses('SurveySubmission.SHOW_ANSWER'): AAT),
};

export const Emoji = {
  FETCH: (generateStatuses('Emoji.FETCH'): AAT),
  FETCH_ALL: (generateStatuses('Emoji.FETCH_ALL'): AAT),
};

/**
 *
 */
export const File = {
  FETCH_SIGNED_POST: (generateStatuses('File.FETCH_SIGNED_POST'): AAT),
  UPLOAD: (generateStatuses('File.UPLOAD'): AAT),
};

/**
 *
 */
export const Feed = {
  FETCH: (generateStatuses('Feed.FETCH'): AAT),
};

export const FetchHistory = {
  CLEAR_HISTORY: 'FetchHistory.CLEAR_HISTORY',
};

/**
 *
 */
export const Routing = {
  SET_STATUS_CODE: 'Routing.SET_STATUS_CODE',
};

/**
 *
 */
export const OAuth2 = {
  FETCH_APPLICATIONS: (generateStatuses('OAuth2.FETCH_APPLICATIONS'): AAT),
  FETCH_APPLICATION: (generateStatuses('OAuth2.FETCH_APPLICATION'): AAT),
  UPDATE_APPLICATION: (generateStatuses('OAuth2.UPDATE_APPLICATION'): AAT),
  CREATE_APPLICATION: (generateStatuses('OAuth2.CREATE_APPLICATION'): AAT),
  FETCH_GRANTS: (generateStatuses('OAuth2.FETCH_GRANTS'): AAT),
  DELETE_GRANT: (generateStatuses('OAuth2.DELETE_GRANT'): AAT),
};

/**
 *
 */
export const NotificationSettings = {
  FETCH_ALTERNATIVES: (generateStatuses(
    'NotificationSettings.FETCH_ALTERNATIVES'
  ): AAT),
  FETCH: (generateStatuses('NotificationSettings.FETCH'): AAT),
  UPDATE: (generateStatuses('NotificationSettings.UPDATE'): AAT),
};

/**
 *
 */
export const Contact = {
  SEND_MESSAGE: (generateStatuses('Contact.SEND_MESSAGE'): AAT),
};

/**
 *
 */
export const Meta = {
  FETCH: (generateStatuses('Meta.FETCH'): AAT),
};

export const Frontpage = {
  FETCH: (generateStatuses('Frontpage.FETCH'): AAT),
};

export const Readme = {
  FETCH: (generateStatuses('Readme.FETCH'): AAT),
};

export const Tag = {
  FETCH: (generateStatuses('Tag.FETCH'): AAT),
  POPULAR: (generateStatuses('Tag.POPULAR'): AAT),
};

export const Podcast = {
  FETCH: (generateStatuses('Podcast.FETCH'): AAT),
  DELETE: (generateStatuses('Podcast.DELETE'): AAT),
  CREATE: (generateStatuses('Podcast.CREATE'): AAT),
  UPDATE: (generateStatuses('Podcast.UPDATE'): AAT),
};

export const Poll = {
  FETCH: (generateStatuses('Poll.FETCH'): AAT),
  FETCH_ALL: (generateStatuses('Poll.FETCH_ALL'): AAT),
  DELETE: (generateStatuses('Poll.DELETE'): AAT),
  CREATE: (generateStatuses('Poll.CREATE'): AAT),
  UPDATE: (generateStatuses('Poll.UPDATE'): AAT),
};

/**
 *
 */
export const Reaction = {
  ADD: (generateStatuses('Reaction.ADD'): AAT),
  DELETE: (generateStatuses('Reaction.DELETE'): AAT),
};
