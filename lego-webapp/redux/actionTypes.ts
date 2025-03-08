export type AsyncActionType = {
  BEGIN: `${string}.BEGIN`;
  SUCCESS: `${string}.SUCCESS`;
  FAILURE: `${string}.FAILURE`;
};

export const generateStatuses = (name: string): AsyncActionType => ({
  BEGIN: `${name}.BEGIN`,
  SUCCESS: `${name}.SUCCESS`,
  FAILURE: `${name}.FAILURE`,
});

export const Event = {
  FETCH: generateStatuses('Event.FETCH'),
  FETCH_PREVIOUS: generateStatuses('Event.FETCH_PREVIOUS'),
  FETCH_UPCOMING: generateStatuses('Event.FETCH_UPCOMING'),
  FETCH_ANALYTICS: generateStatuses('Event.FETCH_ANALYTICS'),
  CREATE: generateStatuses('Event.CREATE'),
  EDIT: generateStatuses('Event.EDIT'),
  DELETE: generateStatuses('Event.DELETE'),
  ADMINISTRATE_FETCH: generateStatuses('Event.ADMINISTRATE_FETCH'),
  REQUEST_REGISTER: generateStatuses('Event.REQUEST_REGISTER'),
  ADMIN_REGISTER: generateStatuses('Event.ADMIN_REGISTER'),
  REQUEST_UNREGISTER: generateStatuses('Event.REQUEST_UNREGISTER'),
  PAYMENT_QUEUE: generateStatuses('Event.PAYMENT_QUEUE'),
  UPDATE_REGISTRATION: generateStatuses('Event.UPDATE_REGISTRATION'),
  SOCKET_REGISTRATION: generateStatuses('Event.SOCKET_REGISTRATION'),
  SOCKET_UNREGISTRATION: generateStatuses('Event.SOCKET_UNREGISTRATION'),
  SOCKET_PAYMENT: generateStatuses('Event.SOCKET_PAYMENT'),
  SOCKET_INITIATE_PAYMENT: generateStatuses('Event.SOCKET_INITIATE_PAYMENT'),
  SOCKET_EVENT_UPDATED: 'SOCKET_EVENT_UPDATED',
  FOLLOW: generateStatuses('Event.FOLLOW'),
  UNFOLLOW: generateStatuses('Event.UNFOLLOW'),
  FETCH_FOLLOWERS: generateStatuses('Event.FETCH_FOLLOWERS'),
};

export const Article = {
  FETCH: generateStatuses('Article.FETCH'),
  CREATE: generateStatuses('Article.CREATE'),
  EDIT: generateStatuses('Article.EDIT'),
  DELETE: generateStatuses('Article.DELETE'),
};

export const EmailList = {
  FETCH: generateStatuses('EmailList.FETCH'),
  CREATE: generateStatuses('EmailList.CREATE'),
  EDIT: generateStatuses('EmailList.EDIT'),
};

export const RestrictedMail = {
  FETCH: generateStatuses('RestrictedMail.FETCH'),
  CREATE: generateStatuses('RestrictedMail.CREATE'),
  EDIT: generateStatuses('RestrictedMail.EDIT'),
};

export const EmailUser = {
  FETCH: generateStatuses('EmailUser.FETCH'),
  CREATE: generateStatuses('EmailUser.CREATE'),
  EDIT: generateStatuses('EmailUser.EDIT'),
};

export const Gallery = {
  FETCH: generateStatuses('Gallery.FETCH'),
  CREATE: generateStatuses('Gallery.CREATE'),
  EDIT: generateStatuses('Gallery.EDIT'),
  UPLOAD: generateStatuses('Gallery.UPLOAD'),
  DELETE: generateStatuses('Gallery.DELETE'),
};
export const ImageGallery = {
  FETCH_ALL: generateStatuses('ImageGallery.FETCH_ALL'),
};

export const GalleryPicture = {
  FETCH: generateStatuses('GalleryPicture.FETCH'),
  CREATE: generateStatuses('GalleryPicture.CREATE'),
  EDIT: generateStatuses('GalleryPicture.EDIT'),
  DELETE: generateStatuses('GalleryPicture.DELETE'),
  UPLOAD: generateStatuses('GalleryPicture.UPLOAD'),
};

export const Joblistings = {
  FETCH: generateStatuses('Joblistings.FETCH'),
  CREATE: generateStatuses('Joblistings.CREATE'),
  EDIT: generateStatuses('Joblistings.EDIT'),
  DELETE: generateStatuses('Joblistings.DELETE'),
};

export const LendableObjects = {
  FETCH: generateStatuses('LendableObject.FETCH_ALL'),
  CREATE: generateStatuses('LendableObject.CREATE'),
  EDIT: generateStatuses('LendableObject.EDIT'),
  DELETE: generateStatuses('LendableObject.DELETE'),
};

export const LendingRequests = {
  FETCH: generateStatuses('LendingRequest.FETCH'),
  FETCH_ADMIN: generateStatuses('LendingRequest.FETCH_ADMIN'),
  CREATE: generateStatuses('LendingRequest.CREATE'),
  EDIT: generateStatuses('LendingRequest.EDIT'),
};

export const Announcements = {
  FETCH_ALL: generateStatuses('Announcements.FETCH_ALL'),
  CREATE: generateStatuses('Announcements.CREATE'),
  SEND: generateStatuses('Announcements.SEND'),
  DELETE: generateStatuses('Announcements.DELETE'),
};

export const Meeting = {
  FETCH: generateStatuses('Meeting.FETCH'),
  SET_INVITATION_STATUS: generateStatuses('Meeting.SET_INVITATION_STATUS'),
  CREATE: generateStatuses('Meeting.CREATE'),
  EDIT: generateStatuses('Meeting.EDIT'),
  DELETE: generateStatuses('Meeting.DELETE'),
  ANSWER_INVITATION_TOKEN: generateStatuses('Meeting.ANSWER_INVITATION_TOKEN'),
};

export const Group = {
  FETCH: generateStatuses('Group.FETCH'),
  UPDATE: generateStatuses('Group.UPDATE'),
  FETCH_ALL: generateStatuses('Group.FETCH_ALL'),
  CREATE: generateStatuses('Group.CREATE'),
  REMOVE: generateStatuses('Group.REMOVE'),
  MEMBERSHIP_FETCH: generateStatuses('Group.MEMBERSHIP_FETCH'),
};
export const CompanyInterestForm = {
  FETCH_ALL: generateStatuses('CompanyInterestForm.FETCH_ALL'),
  FETCH: generateStatuses('CompanyInterestForm.FETCH'),
  CREATE: generateStatuses('CompanyInterestForm.CREATE'),
  DELETE: generateStatuses('CompanyInterestForm.DELETE'),
  UPDATE: generateStatuses('CompanyInterestForm.UPDATE'),
};
export const Membership = {
  CREATE: generateStatuses('Membership.CREATE'),
  UPDATE: generateStatuses('Membership.UPDATE'),
  REMOVE: generateStatuses('Membership.REMOVE'),
  JOIN_GROUP: generateStatuses('Membership.JOIN_GROUP'),
  LEAVE_GROUP: generateStatuses('Membership.LEAVE_GROUP'),
};
export const MembershipHistory = {
  DELETE: generateStatuses('MembershipHistory.DELETE'),
};

export const Favorite = {
  FETCH_ALL: generateStatuses('Favorite.FETCH_ALL'),
};

export const Comment = {
  ADD: generateStatuses('Comment.ADD'),
  DELETE: generateStatuses('Comment.DELETE'),
};

export const Company = {
  FETCH: generateStatuses('Company.FETCH'),
  FETCH_COMPANY_CONTACT: generateStatuses('Company.FETCH_COMPANY_CONTACT'),
  ADD: generateStatuses('Company.ADD'),
  EDIT: generateStatuses('Company.EDIT'),
  DELETE: generateStatuses('Company.DELETE'),
  ADD_SEMESTER_STATUS: generateStatuses('Company.ADD_SEMESTER_STATUS'),
  EDIT_SEMESTER_STATUS: generateStatuses('Company.EDIT_SEMESTER_STATUS'),
  DELETE_SEMESTER_STATUS: generateStatuses('Company.DELETE_SEMESTER_STATUS'),
  ADD_COMPANY_CONTACT: generateStatuses('Company.ADD_COMPANY_CONTACT'),
  EDIT_COMPANY_CONTACT: generateStatuses('Company.EDIT_COMPANY_CONTACT'),
  DELETE_COMPANY_CONTACT: generateStatuses('Company.DELETE_COMPANY_CONTACT'),
  FETCH_SEMESTERS: generateStatuses('Company.FETCH_SEMESTERS'),
  ADD_SEMESTER: generateStatuses('Company.ADD_SEMESTER'),
  EDIT_SEMESTER: generateStatuses('Company.EDIT_SEMESTER'),
};

export const Quote = {
  FETCH: generateStatuses('Quote.FETCH'),
  FETCH_ALL_APPROVED: generateStatuses('Quote.FETCH_ALL_APPROVED'),
  FETCH_ALL_UNAPPROVED: generateStatuses('Quote.FETCH_ALL_UNAPPROVED'),
  FETCH_RANDOM: generateStatuses('Quote.FETCH_RANDOM'),
  APPROVE: generateStatuses('Quote.APPROVE'),
  UNAPPROVE: generateStatuses('Quote.UNAPPROVE'),
  DELETE: generateStatuses('Quote.DELETE'),
  ADD: generateStatuses('Quote.ADD'),
};

export const Search = {
  SEARCH: generateStatuses('Search.SEARCH'),
  AUTOCOMPLETE: generateStatuses('Search.AUTOCOMPLETE'),
  RESULTS_RECEIVED: 'Search.RESULTS_RECEIVED',
  TOGGLE_OPEN: 'Search.TOGGLE_OPEN',
  MENTION: generateStatuses('Search.MENTION'),
};
export const NotificationsFeed = {
  FETCH_DATA: generateStatuses('NotificationsFeed.FETCH_DATA'),
  MARK_ALL: generateStatuses('NotificationsFeed.MARK_ALL'),
  MARK: generateStatuses('NotificationsFeed.MARK'),
};

export const User = {
  FETCH: generateStatuses('User.FETCH'),
  FETCH_LEADERBOARD: generateStatuses('User.FETCH_LEADERBOARD'),
  UPDATE: generateStatuses('User.UPDATE'),
  PASSWORD_CHANGE: generateStatuses('User.PASSWORD_CHANGE'),
  LOGIN: generateStatuses('User.LOGIN'),
  LOGOUT: 'User.LOGOUT',
  DELETE: generateStatuses('User.DELETE'),
  SOCKET: generateStatuses('User.SOCKET'),
  SEND_REGISTRATION_TOKEN: generateStatuses('User.SEND_REGISTRATION_TOKEN'),
  VALIDATE_REGISTRATION_TOKEN: generateStatuses(
    'User.VALIDATE_REGISTRATION_TOKEN',
  ),
  CREATE_USER: generateStatuses('User.CREATE_USER'),
  INIT_STUDENT_AUTH: generateStatuses('User.INIT_STUDENT_AUTH'),
  COMPLETE_STUDENT_AUTH: generateStatuses('User.COMPLETE_STUDENT_AUTH'),
  SEND_FORGOT_PASSWORD_REQUEST: generateStatuses(
    'User.SEND_FORGOT_PASSWORD_REQUEST',
  ),
  RESET_PASSWORD: generateStatuses('User.RESET_PASSWORD'),
  REFRESH_TOKEN: generateStatuses('User.REFRESH_TOKEN'),
};
export const Penalty = {
  FETCH: generateStatuses('Penalty.FETCH'),
  CREATE: generateStatuses('Penalty.CREATE'),
  DELETE: generateStatuses('Penalty.DELETE'),
};

export const Page = {
  FETCH: generateStatuses('Page.FETCH'),
  CREATE: generateStatuses('Page.CREATE'),
  UPDATE: generateStatuses('Page.UPDATE'),
  DELETE: generateStatuses('Page.DELETE'),
};

export const Bdb = {
  FETCH: generateStatuses('Bdb.FETCH'),
};

export const Survey = {
  FETCH: generateStatuses('Survey.FETCH'),
  ADD: generateStatuses('Survey.ADD'),
  EDIT: generateStatuses('Survey.EDIT'),
  SHARE: generateStatuses('Survey.SHARE'),
  HIDE: generateStatuses('Survey.HIDE'),
};

export const SurveySubmission = {
  FETCH_ALL: generateStatuses('SurveySubmission.FETCH_ALL'),
  FETCH: generateStatuses('SurveySubmission.FETCH'),
  ADD: generateStatuses('SurveySubmission.ADD'),
  DELETE: generateStatuses('SurveySubmission.DELETE'),
  HIDE_ANSWER: generateStatuses('SurveySubmission.HIDE_ANSWER'),
  SHOW_ANSWER: generateStatuses('SurveySubmission.SHOW_ANSWER'),
};
export const Emoji = {
  FETCH: generateStatuses('Emoji.FETCH'),
  FETCH_ALL: generateStatuses('Emoji.FETCH_ALL'),
};

export const File = {
  FETCH_SIGNED_POST: generateStatuses('File.FETCH_SIGNED_POST'),
  UPLOAD: generateStatuses('File.UPLOAD'),
  PATCH: generateStatuses('File.PATCH'),
};

export const Feed = {
  FETCH: generateStatuses('Feed.FETCH'),
};

export const OAuth2 = {
  FETCH_APPLICATIONS: generateStatuses('OAuth2.FETCH_APPLICATIONS'),
  FETCH_APPLICATION: generateStatuses('OAuth2.FETCH_APPLICATION'),
  UPDATE_APPLICATION: generateStatuses('OAuth2.UPDATE_APPLICATION'),
  CREATE_APPLICATION: generateStatuses('OAuth2.CREATE_APPLICATION'),
  FETCH_GRANTS: generateStatuses('OAuth2.FETCH_GRANTS'),
  DELETE_GRANT: generateStatuses('OAuth2.DELETE_GRANT'),
};

export const NotificationSettings = {
  FETCH_ALTERNATIVES: generateStatuses(
    'NotificationSettings.FETCH_ALTERNATIVES',
  ),
  FETCH: generateStatuses('NotificationSettings.FETCH'),
  UPDATE: generateStatuses('NotificationSettings.UPDATE'),
};

export const Contact = {
  SEND_MESSAGE: generateStatuses('Contact.SEND_MESSAGE'),
};

export const Meta = {
  FETCH: generateStatuses('Meta.FETCH'),
};
export const Frontpage = {
  FETCH: generateStatuses('Frontpage.FETCH'),
};
export const Tag = {
  FETCH: generateStatuses('Tag.FETCH'),
};
export const Podcast = {
  FETCH: generateStatuses('Podcast.FETCH'),
  DELETE: generateStatuses('Podcast.DELETE'),
  CREATE: generateStatuses('Podcast.CREATE'),
  UPDATE: generateStatuses('Podcast.UPDATE'),
};
export const Poll = {
  FETCH: generateStatuses('Poll.FETCH'),
  FETCH_ALL: generateStatuses('Poll.FETCH_ALL'),
  DELETE: generateStatuses('Poll.DELETE'),
  CREATE: generateStatuses('Poll.CREATE'),
  UPDATE: generateStatuses('Poll.UPDATE'),
};

export const Reaction = {
  ADD: generateStatuses('Reaction.ADD'),
  DELETE: generateStatuses('Reaction.DELETE'),
};

export const Forum = {
  FETCH_ALL: generateStatuses('Forum.FETCH_ALL'),
  CREATE: generateStatuses('Forum.CREATE'),
  FETCH: generateStatuses('Forum. FETCH'),
  DELETE: generateStatuses('Forum.DELETE'),
  UPDATE: generateStatuses('Forum.UPDATE'),
};

export const Thread = {
  FETCH_ALL: generateStatuses('Thread.FETCH_ALL'),
  CREATE: generateStatuses('Thread.CREATE'),
  FETCH: generateStatuses('Thread. FETCH'),
  DELETE: generateStatuses('Thread.DELETE'),
  UPDATE: generateStatuses('Thread.UPDATE'),
};

export const Achievement = {
  CREATE: generateStatuses('Achievement.CREATE'),
};

export const Banner = {
  FETCH: generateStatuses('Banner.FETCH'),
  CREATE: generateStatuses('Banner.CREATE'),
  EDIT: generateStatuses('Banner.EDIT'),
  DELETE: generateStatuses('Banner.DELETE'),
};

export const FeatureFlag = {
  FETCH_ALL: generateStatuses('FeatureFlag.FETCH_ALL'),
  FETCH: generateStatuses('FeatureFlag.FETCH'),
  CREATE: generateStatuses('FeatureFlag.CREATE'),
  EDIT: generateStatuses('FeatureFlag.EDIT'),
  DELETE: generateStatuses('FeatureFlag.DELETE'),
};
