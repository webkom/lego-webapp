// @flow

import { connectRouter } from 'connected-react-router';
import { type Schema, schema } from 'normalizr';
import { combineReducers } from 'redux';

import { type LocationType } from 'app/models';
import { type Reducer } from 'app/types';
import joinReducers from 'app/utils/joinReducers';
import allowed from './allowed';
import announcements from './announcements';
import articles from './articles';
import auth from './auth';
import comments from './comments';
import companies from './companies';
import companyInterest from './companyInterest';
import companySemesters from './companySemesters';
import emailLists from './emailLists';
import emailUsers from './emailUsers';
import emojis from './emojis';
import events from './events';
import feedActivities from './feedActivities';
import feeds from './feeds';
import fetchHistory from './fetchHistory';
import {
  followersCompany,
  followersEvent,
  followersKeyGen,
  followersUser,
} from './followers';
import form from './forms';
import frontpage from './frontpage';
import galleries from './galleries';
import galleryPictures from './galleryPictures';
import groups from './groups';
import joblistings from './joblistings';
import meetingInvitations, {
  getMeetingInvitationId,
} from './meetingInvitations';
import meetings from './meetings';
import meetingsToken from './meetingsToken';
import memberships from './memberships';
import notificationSettings from './notificationSettings';
import notificationsFeed from './notificationsFeed';
import { oauth2Applications, oauth2Grants } from './oauth2';
import pages from './pages';
import penalties from './penalties';
import podcasts from './podcasts';
import polls from './polls';
import pools from './pools';
import quotes from './quotes';
import reactions from './reactions';
import readme from './readme';
import registrations from './registrations';
import restrictedMails from './restrictedMails';
import routing from './routing';
import search from './search';
import surveys from './surveys';
import surveySubmissions from './surveySubmissions';
import tags from './tags';
import toasts from './toasts';
import users from './users';

const reducers = {
  allowed,
  announcements,
  articles,
  auth,
  comments,
  companies,
  companyInterest,
  companySemesters,
  emailLists,
  emailUsers,
  events,
  feedActivities,
  feeds,
  fetchHistory,
  form,
  frontpage,
  galleries,
  galleryPictures,
  groups,
  joblistings,
  meetingInvitations,
  meetings,
  meetingsToken,
  memberships,
  notificationSettings,
  notificationsFeed,
  oauth2Applications,
  oauth2Grants,
  pages,
  penalties,
  podcasts,
  polls,
  pools,
  quotes,
  readme,
  registrations,
  restrictedMails,
  search,
  emojis,
  reactions,
  surveySubmissions,
  surveys,
  tags,
  toasts,
  users,
  followersCompany,
  followersUser,
  followersEvent,
};

export type Reducers = typeof reducers;

type History = {
  length: Number,
  action: string,
  location: LocationType,
  createHref: (location: LocationType) => string,
  push: (path: string, state: Object) => void,
  replace: (path: string, state: Object) => void,
  go: (n: Number) => void,
  goBack: () => void,
  block: (prompt?: boolean) => () => void,
  listen: (listener: () => void) => () => void,
};

export default function rootReducer(history: History): Reducer {
  return combineReducers({
    router: joinReducers(connectRouter(history), routing),
    ...reducers,
  });
}

export const restrictedMailSchema = ((new schema.Entity(
  'restrictedMails'
): Schema): Schema);

export const groupSchema = (new schema.Entity('groups'): Schema);
export const penaltySchema = (new schema.Entity('penalties', {}): Schema);
export const userSchema = (new schema.Entity('users', {
  abakusGroups: [groupSchema],
  penalties: [penaltySchema],
}): Schema);
export const emailUserSchema = (new schema.Entity('emailUsers', {
  user: userSchema,
}): Schema);
export const emailListSchema = (new schema.Entity('emailLists', {
  users: [userSchema],
  groups: [groupSchema],
}): Schema);

export const registrationSchema = (new schema.Entity('registrations', {
  user: userSchema,
}): Schema);
export const poolSchema = (new schema.Entity('pools', {
  registrations: [registrationSchema],
}): Schema);
export const commentSchema = (new schema.Entity('comments'): Schema);
export const eventSchema = (new schema.Entity('events', {
  pools: [poolSchema],
  comments: [commentSchema],
  waitingRegistrations: [registrationSchema],
  pendingRegistration: registrationSchema,
}): Schema);
export const eventAdministrateSchema = (new schema.Entity('events', {
  pools: [poolSchema],
  unregistered: [registrationSchema],
  waitingRegistrations: [registrationSchema],
}): Schema);
export const reactionSchema = (new schema.Entity('reactions'): Schema);
export const articleSchema = (new schema.Entity('articles', {
  comments: [commentSchema],
  reactions: [reactionSchema],
  author: userSchema,
}): Schema);

export const galleryPictureSchema = (new schema.Entity('galleryPictures', {
  comments: [commentSchema],
}): Schema);

export const gallerySchema = (new schema.Entity('galleries'): Schema);

export const quoteSchema = (new schema.Entity('quotes'): Schema);

export const pollSchema = (new schema.Entity('polls'): Schema);

export const podcastSchema = (new schema.Entity('podcasts'): Schema);

export const pageSchema = (new schema.Entity(
  'pages',
  {},
  { idAttribute: 'slug' }
): Schema);
export const companySemesterSchema = (new schema.Entity(
  'companySemesters'
): Schema);
export const companyInterestSchema = (new schema.Entity('companyInterest', {
  semesters: [companySemesterSchema],
}): Schema);
export const companySchema = (new schema.Entity('companies', {
  studentContact: userSchema,
  comments: [commentSchema],
}): Schema);
export const joblistingsSchema = (new schema.Entity('joblistings'): Schema);
export const announcementsSchema = (new schema.Entity('announcements'): Schema);
export const feedActivitySchema = (new schema.Entity('feedActivities'): Schema);
export const oauth2ApplicationSchema = (new schema.Entity(
  'oauth2Application'
): Schema);
export const oauth2GrantSchema = (new schema.Entity('oauth2Grant'): Schema);
export const membershipSchema = (new schema.Entity('memberships', {
  user: userSchema,
}): Schema);
export const meetingInvitationSchema = (new schema.Entity(
  'meetingInvitations',
  {
    user: userSchema,
  },
  {
    idAttribute: (invite) =>
      getMeetingInvitationId(invite.meeting, invite.user.username),
  }
): Schema);
export const meetingSchema = (new schema.Entity('meetings', {
  invitations: [meetingInvitationSchema],
  reportAuthor: userSchema,
  createdBy: userSchema,
  comments: [commentSchema],
}): Schema);
export const frontpageSchema = (new schema.Entity('frontpage', {
  events: [eventSchema],
  articles: [articleSchema],
  poll: pollSchema,
}): Schema);
export const emojiSchema = (new schema.Entity(
  'emojis',
  {},
  { idAttribute: 'shortCode' }
): Schema);
export const surveySchema = (new schema.Entity('surveys', {
  event: eventSchema,
}): Schema);
export const surveySubmissionSchema = (new schema.Entity('surveySubmissions', {
  user: userSchema,
}): Schema);
export const tagSchema = (new schema.Entity(
  'tags',
  {},
  { idAttribute: 'tag' }
): Schema);

export const followersEventSchema = (new schema.Entity(
  followersKeyGen('event'),
  {
    follower: userSchema,
  }
): Schema);

export const followersCompanySchema = (new schema.Entity(
  followersKeyGen('company'),
  {
    follower: userSchema,
  }
): Schema);

export const followersUserSchema = (new schema.Entity(followersKeyGen('user'), {
  follower: userSchema,
}): Schema);
