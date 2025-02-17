import type { AsyncActionType } from 'app/types';

export const generateStatuses = (name: string): AsyncActionType => ({
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
  FETCH: generateStatuses('Event.FETCH') as AAT,
  FETCH_PREVIOUS: generateStatuses('Event.FETCH_PREVIOUS') as AAT,
  FETCH_UPCOMING: generateStatuses('Event.FETCH_UPCOMING') as AAT,
  FETCH_ANALYTICS: generateStatuses('Event.FETCH_ANALYTICS') as AAT,
  CREATE: generateStatuses('Event.CREATE') as AAT,
  EDIT: generateStatuses('Event.EDIT') as AAT,
  DELETE: generateStatuses('Event.DELETE') as AAT,
  ADMINISTRATE_FETCH: generateStatuses('Event.ADMINISTRATE_FETCH') as AAT,
  REQUEST_REGISTER: generateStatuses('Event.REQUEST_REGISTER') as AAT,
  ADMIN_REGISTER: generateStatuses('Event.ADMIN_REGISTER') as AAT,
  REQUEST_UNREGISTER: generateStatuses('Event.REQUEST_UNREGISTER') as AAT,
  PAYMENT_QUEUE: generateStatuses('Event.PAYMENT_QUEUE') as AAT,
  UPDATE_REGISTRATION: generateStatuses('Event.UPDATE_REGISTRATION') as AAT,
  SOCKET_REGISTRATION: generateStatuses('Event.SOCKET_REGISTRATION') as AAT,
  SOCKET_UNREGISTRATION: generateStatuses('Event.SOCKET_UNREGISTRATION') as AAT,
  SOCKET_PAYMENT: generateStatuses('Event.SOCKET_PAYMENT') as AAT,
  SOCKET_INITIATE_PAYMENT: generateStatuses(
    'Event.SOCKET_INITIATE_PAYMENT',
  ) as AAT,
  SOCKET_EVENT_UPDATED: 'SOCKET_EVENT_UPDATED',
  FOLLOW: generateStatuses('Event.FOLLOW') as AAT,
  UNFOLLOW: generateStatuses('Event.UNFOLLOW') as AAT,
  FETCH_FOLLOWERS: generateStatuses('Event.FETCH_FOLLOWERS') as AAT,
};

/**
 *
 */
export const Article = {
  FETCH: generateStatuses('Article.FETCH') as AAT,
  CREATE: generateStatuses('Article.CREATE') as AAT,
  EDIT: generateStatuses('Article.EDIT') as AAT,
  DELETE: generateStatuses('Article.DELETE') as AAT,
};

/**
 *
 */
export const EmailList = {
  FETCH: generateStatuses('EmailList.FETCH') as AAT,
  CREATE: generateStatuses('EmailList.CREATE') as AAT,
  EDIT: generateStatuses('EmailList.EDIT') as AAT,
};

/**
 *
 */
export const RestrictedMail = {
  FETCH: generateStatuses('RestrictedMail.FETCH') as AAT,
  CREATE: generateStatuses('RestrictedMail.CREATE') as AAT,
  EDIT: generateStatuses('RestrictedMail.EDIT') as AAT,
};

/**
 *
 */
export const EmailUser = {
  FETCH: generateStatuses('EmailUser.FETCH') as AAT,
  CREATE: generateStatuses('EmailUser.CREATE') as AAT,
  EDIT: generateStatuses('EmailUser.EDIT') as AAT,
};

/**
 *
 */
export const Gallery = {
  FETCH: generateStatuses('Gallery.FETCH') as AAT,
  CREATE: generateStatuses('Gallery.CREATE') as AAT,
  EDIT: generateStatuses('Gallery.EDIT') as AAT,
  UPLOAD: generateStatuses('Gallery.UPLOAD') as AAT,
  DELETE: generateStatuses('Gallery.DELETE') as AAT,
};
export const ImageGallery = {
  FETCH_ALL: generateStatuses('ImageGallery.FETCH_ALL') as AAT,
};

/**
 *
 */
export const GalleryPicture = {
  FETCH: generateStatuses('GalleryPicture.FETCH') as AAT,
  CREATE: generateStatuses('GalleryPicture.CREATE') as AAT,
  EDIT: generateStatuses('GalleryPicture.EDIT') as AAT,
  DELETE: generateStatuses('GalleryPicture.DELETE') as AAT,
  UPLOAD: generateStatuses('GalleryPicture.UPLOAD') as AAT,
};

/**
 *
 */
export const Joblistings = {
  FETCH: generateStatuses('Joblistings.FETCH') as AAT,
  CREATE: generateStatuses('Joblistings.CREATE') as AAT,
  EDIT: generateStatuses('Joblistings.EDIT') as AAT,
  DELETE: generateStatuses('Joblistings.DELETE') as AAT,
};

export const LendableObjects = {
  FETCH: generateStatuses('LendableObject.FETCH_ALL') as AAT,
  CREATE: generateStatuses('LendableObject.CREATE') as AAT,
  EDIT: generateStatuses('LendableObject.EDIT') as AAT,
  DELETE: generateStatuses('LendableObject.DELETE') as AAT,
};

/**
 *
 */
export const Announcements = {
  FETCH_ALL: generateStatuses('Announcements.FETCH_ALL') as AAT,
  CREATE: generateStatuses('Announcements.CREATE') as AAT,
  SEND: generateStatuses('Announcements.SEND') as AAT,
  DELETE: generateStatuses('Announcements.DELETE') as AAT,
};

/**
 *
 */
export const Meeting = {
  FETCH: generateStatuses('Meeting.FETCH') as AAT,
  SET_INVITATION_STATUS: generateStatuses(
    'Meeting.SET_INVITATION_STATUS',
  ) as AAT,
  CREATE: generateStatuses('Meeting.CREATE') as AAT,
  EDIT: generateStatuses('Meeting.EDIT') as AAT,
  DELETE: generateStatuses('Meeting.DELETE') as AAT,
  ANSWER_INVITATION_TOKEN: generateStatuses(
    'Meeting.ANSWER_INVITATION_TOKEN',
  ) as AAT,
};

/**
 *
 */
export const Group = {
  FETCH: generateStatuses('Group.FETCH') as AAT,
  UPDATE: generateStatuses('Group.UPDATE') as AAT,
  FETCH_ALL: generateStatuses('Group.FETCH_ALL') as AAT,
  CREATE: generateStatuses('Group.CREATE') as AAT,
  REMOVE: generateStatuses('Group.REMOVE') as AAT,
  MEMBERSHIP_FETCH: generateStatuses('Group.MEMBERSHIP_FETCH') as AAT,
};
export const CompanyInterestForm = {
  FETCH_ALL: generateStatuses('CompanyInterestForm.FETCH_ALL') as AAT,
  FETCH: generateStatuses('CompanyInterestForm.FETCH') as AAT,
  CREATE: generateStatuses('CompanyInterestForm.CREATE') as AAT,
  DELETE: generateStatuses('CompanyInterestForm.DELETE') as AAT,
  UPDATE: generateStatuses('CompanyInterestForm.UPDATE') as AAT,
};
export const Membership = {
  CREATE: generateStatuses('Membership.CREATE') as AAT,
  UPDATE: generateStatuses('Membership.UPDATE') as AAT,
  REMOVE: generateStatuses('Membership.REMOVE') as AAT,
  JOIN_GROUP: generateStatuses('Membership.JOIN_GROUP') as AAT,
  LEAVE_GROUP: generateStatuses('Membership.LEAVE_GROUP') as AAT,
};
export const MembershipHistory = {
  DELETE: generateStatuses('MembershipHistory.DELETE') as AAT,
}
/**
 *
 */
export const Favorite = {
  FETCH_ALL: generateStatuses('Favorite.FETCH_ALL') as AAT,
};

/**
 *
 */
export const Comment = {
  ADD: generateStatuses('Comment.ADD') as AAT,
  DELETE: generateStatuses('Comment.DELETE') as AAT,
};

/**
 *
 */
export const Company = {
  FETCH: generateStatuses('Company.FETCH') as AAT,
  FETCH_COMPANY_CONTACT: generateStatuses(
    'Company.FETCH_COMPANY_CONTACT',
  ) as AAT,
  ADD: generateStatuses('Company.ADD') as AAT,
  EDIT: generateStatuses('Company.EDIT') as AAT,
  DELETE: generateStatuses('Company.DELETE') as AAT,
  ADD_SEMESTER_STATUS: generateStatuses('Company.ADD_SEMESTER_STATUS') as AAT,
  EDIT_SEMESTER_STATUS: generateStatuses('Company.EDIT_SEMESTER_STATUS') as AAT,
  DELETE_SEMESTER_STATUS: generateStatuses(
    'Company.DELETE_SEMESTER_STATUS',
  ) as AAT,
  ADD_COMPANY_CONTACT: generateStatuses('Company.ADD_COMPANY_CONTACT') as AAT,
  EDIT_COMPANY_CONTACT: generateStatuses('Company.EDIT_COMPANY_CONTACT') as AAT,
  DELETE_COMPANY_CONTACT: generateStatuses(
    'Company.DELETE_COMPANY_CONTACT',
  ) as AAT,
  FETCH_SEMESTERS: generateStatuses('Company.FETCH_SEMESTERS') as AAT,
  ADD_SEMESTER: generateStatuses('Company.ADD_SEMESTER') as AAT,
  EDIT_SEMESTER: generateStatuses('Company.EDIT_SEMESTER') as AAT,
};

/**
 *
 */
export const Quote = {
  FETCH: generateStatuses('Quote.FETCH') as AAT,
  FETCH_ALL_APPROVED: generateStatuses('Quote.FETCH_ALL_APPROVED') as AAT,
  FETCH_ALL_UNAPPROVED: generateStatuses('Quote.FETCH_ALL_UNAPPROVED') as AAT,
  FETCH_RANDOM: generateStatuses('Quote.FETCH_RANDOM') as AAT,
  APPROVE: generateStatuses('Quote.APPROVE') as AAT,
  UNAPPROVE: generateStatuses('Quote.UNAPPROVE') as AAT,
  DELETE: generateStatuses('Quote.DELETE') as AAT,
  ADD: generateStatuses('Quote.ADD') as AAT,
};

/**
 *
 */
export const Search = {
  SEARCH: generateStatuses('Search.SEARCH') as AAT,
  AUTOCOMPLETE: generateStatuses('Search.AUTOCOMPLETE') as AAT,
  RESULTS_RECEIVED: 'Search.RESULTS_RECEIVED',
  TOGGLE_OPEN: 'Search.TOGGLE_OPEN',
  MENTION: generateStatuses('Search.MENTION') as AAT,
};
export const NotificationsFeed = {
  FETCH_DATA: generateStatuses('NotificationsFeed.FETCH_DATA') as AAT,
  MARK_ALL: generateStatuses('NotificationsFeed.MARK_ALL') as AAT,
  MARK: generateStatuses('NotificationsFeed.MARK') as AAT,
};

/**
 *
 */
export const User = {
  FETCH: generateStatuses('User.FETCH') as AAT,
  FETCH_LEADERBOARD: generateStatuses('User.FETCH_LEADERBOARD') as AAT,
  UPDATE: generateStatuses('User.UPDATE') as AAT,
  PASSWORD_CHANGE: generateStatuses('User.PASSWORD_CHANGE') as AAT,
  LOGIN: generateStatuses('User.LOGIN') as AAT,
  LOGOUT: 'User.LOGOUT',
  DELETE: generateStatuses('User.DELETE') as AAT,
  SOCKET: generateStatuses('User.SOCKET') as AAT,
  SEND_REGISTRATION_TOKEN: generateStatuses(
    'User.SEND_REGISTRATION_TOKEN',
  ) as AAT,
  VALIDATE_REGISTRATION_TOKEN: generateStatuses(
    'User.VALIDATE_REGISTRATION_TOKEN',
  ) as AAT,
  CREATE_USER: generateStatuses('User.CREATE_USER') as AAT,
  INIT_STUDENT_AUTH: generateStatuses('User.INIT_STUDENT_AUTH') as AAT,
  COMPLETE_STUDENT_AUTH: generateStatuses('User.COMPLETE_STUDENT_AUTH') as AAT,
  SEND_FORGOT_PASSWORD_REQUEST: generateStatuses(
    'User.SEND_FORGOT_PASSWORD_REQUEST',
  ) as AAT,
  RESET_PASSWORD: generateStatuses('User.RESET_PASSWORD') as AAT,
  REFRESH_TOKEN: generateStatuses('User.REFRESH_TOKEN') as AAT,
};
export const Penalty = {
  FETCH: generateStatuses('Penalty.FETCH') as AAT,
  CREATE: generateStatuses('Penalty.CREATE') as AAT,
  DELETE: generateStatuses('Penalty.DELETE') as AAT,
};

/**
 *
 */
export const Page = {
  FETCH: generateStatuses('Page.FETCH') as AAT,
  CREATE: generateStatuses('Page.CREATE') as AAT,
  UPDATE: generateStatuses('Page.UPDATE') as AAT,
  DELETE: generateStatuses('Page.DELETE') as AAT,
};

/**
 *
 */
export const Bdb = {
  FETCH: generateStatuses('Bdb.FETCH') as AAT,
};

/**
 *
 */
export const Survey = {
  FETCH: generateStatuses('Survey.FETCH') as AAT,
  ADD: generateStatuses('Survey.ADD') as AAT,
  EDIT: generateStatuses('Survey.EDIT') as AAT,
  SHARE: generateStatuses('Survey.SHARE') as AAT,
  HIDE: generateStatuses('Survey.HIDE') as AAT,
};

/**
 *
 */
export const SurveySubmission = {
  FETCH_ALL: generateStatuses('SurveySubmission.FETCH_ALL') as AAT,
  FETCH: generateStatuses('SurveySubmission.FETCH') as AAT,
  ADD: generateStatuses('SurveySubmission.ADD') as AAT,
  DELETE: generateStatuses('SurveySubmission.DELETE') as AAT,
  HIDE_ANSWER: generateStatuses('SurveySubmission.HIDE_ANSWER') as AAT,
  SHOW_ANSWER: generateStatuses('SurveySubmission.SHOW_ANSWER') as AAT,
};
export const Emoji = {
  FETCH: generateStatuses('Emoji.FETCH') as AAT,
  FETCH_ALL: generateStatuses('Emoji.FETCH_ALL') as AAT,
};

/**
 *
 */
export const File = {
  FETCH_SIGNED_POST: generateStatuses('File.FETCH_SIGNED_POST') as AAT,
  UPLOAD: generateStatuses('File.UPLOAD') as AAT,
  PATCH: generateStatuses('File.PATCH') as AAT,
};

/**
 *
 */
export const Feed = {
  FETCH: generateStatuses('Feed.FETCH') as AAT,
};

/**
 *
 */
export const OAuth2 = {
  FETCH_APPLICATIONS: generateStatuses('OAuth2.FETCH_APPLICATIONS') as AAT,
  FETCH_APPLICATION: generateStatuses('OAuth2.FETCH_APPLICATION') as AAT,
  UPDATE_APPLICATION: generateStatuses('OAuth2.UPDATE_APPLICATION') as AAT,
  CREATE_APPLICATION: generateStatuses('OAuth2.CREATE_APPLICATION') as AAT,
  FETCH_GRANTS: generateStatuses('OAuth2.FETCH_GRANTS') as AAT,
  DELETE_GRANT: generateStatuses('OAuth2.DELETE_GRANT') as AAT,
};

/**
 *
 */
export const NotificationSettings = {
  FETCH_ALTERNATIVES: generateStatuses(
    'NotificationSettings.FETCH_ALTERNATIVES',
  ) as AAT,
  FETCH: generateStatuses('NotificationSettings.FETCH') as AAT,
  UPDATE: generateStatuses('NotificationSettings.UPDATE') as AAT,
};

/**
 *
 */
export const Contact = {
  SEND_MESSAGE: generateStatuses('Contact.SEND_MESSAGE') as AAT,
};

/**
 *
 */
export const Meta = {
  FETCH: generateStatuses('Meta.FETCH') as AAT,
};
export const Frontpage = {
  FETCH: generateStatuses('Frontpage.FETCH') as AAT,
};
export const Tag = {
  FETCH: generateStatuses('Tag.FETCH') as AAT,
};
export const Podcast = {
  FETCH: generateStatuses('Podcast.FETCH') as AAT,
  DELETE: generateStatuses('Podcast.DELETE') as AAT,
  CREATE: generateStatuses('Podcast.CREATE') as AAT,
  UPDATE: generateStatuses('Podcast.UPDATE') as AAT,
};
export const Poll = {
  FETCH: generateStatuses('Poll.FETCH') as AAT,
  FETCH_ALL: generateStatuses('Poll.FETCH_ALL') as AAT,
  DELETE: generateStatuses('Poll.DELETE') as AAT,
  CREATE: generateStatuses('Poll.CREATE') as AAT,
  UPDATE: generateStatuses('Poll.UPDATE') as AAT,
};

/**
 *
 */
export const Reaction = {
  ADD: generateStatuses('Reaction.ADD') as AAT,
  DELETE: generateStatuses('Reaction.DELETE') as AAT,
};

export const Forum = {
  FETCH_ALL: generateStatuses('Forum.FETCH_ALL') as AAT,
  CREATE: generateStatuses('Forum.CREATE') as AAT,
  FETCH: generateStatuses('Forum. FETCH') as AAT,
  DELETE: generateStatuses('Forum.DELETE') as AAT,
  UPDATE: generateStatuses('Forum.UPDATE') as AAT,
};

export const Thread = {
  FETCH_ALL: generateStatuses('Thread.FETCH_ALL') as AAT,
  CREATE: generateStatuses('Thread.CREATE') as AAT,
  FETCH: generateStatuses('Thread. FETCH') as AAT,
  DELETE: generateStatuses('Thread.DELETE') as AAT,
  UPDATE: generateStatuses('Thread.UPDATE') as AAT,
};

/**
 *
 */
export const Achievement = {
  CREATE: generateStatuses('Achievement.CREATE') as AAT,
};
