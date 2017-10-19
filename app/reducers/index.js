// @flow

import { schema } from 'normalizr';
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import routing from './routing';
import allowed from './allowed';
import form from './forms';
import companies from './companies';
import companySemesters from './companySemesters';
import quotes from './quotes';
import pictures from './pictures';
import events from './events';
import articles from './articles';
import pools from './pools';
import registrations from './registrations';
import meetingsToken from './meetingsToken';
import meetings from './meetings';
import meetingInvitations, {
  getMeetingInvitationId
} from './meetingInvitations';
import memberships from './memberships';
import search from './search';
import auth from './auth';
import users from './users';
import groups from './groups';
import { oauth2Applications, oauth2Grants } from './oauth2';
import notifications from './notifications';
import notificationsFeed from './notificationsFeed';
import notificationSettings from './notificationSettings';
import galleries from './galleries';
import comments from './comments';
import pages from './pages';
import interestGroups from './interestGroups';
import companyInterest from './companyInterest';
import joblistings from './joblistings';
import announcements from './announcements';
import feedActivities from './feedActivities';
import feeds from './feeds';
import fetchHistory from './fetchHistory';
import { User } from '../actions/ActionTypes';
import type { State, Action } from 'app/types';

const reduceReducers = (...reducers) => (prev, curr) =>
  reducers.reduce((p, r) => r(p, curr), prev);

const reducers = {
  allowed,
  quotes,
  events,
  pictures,
  articles,
  pools,
  registrations,
  meetingsToken,
  meetings,
  meetingInvitations,
  memberships,
  companyInterest,
  interestGroups,
  search,
  comments,
  auth,
  form,
  users,
  groups,
  oauth2Applications,
  oauth2Grants,
  pages,
  galleries,
  notifications,
  notificationsFeed,
  notificationSettings,
  routing: reduceReducers(routing, routerReducer),
  joblistings,
  announcements,
  feedActivities,
  feeds,
  fetchHistory,
  companies,
  companySemesters
};

export type Reducers = typeof reducers;

const appReducer = combineReducers(reducers);

export default function rootReducer(state: State, action: Action) {
  if (action.type === User.LOGOUT) {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
}

export const userSchema = new schema.Entity(
  'users',
  {},
  { idAttribute: 'username' }
);
export const registrationSchema = new schema.Entity('registrations', {
  user: userSchema
});
export const poolSchema = new schema.Entity('pools', {
  registrations: [registrationSchema]
});
export const commentSchema = new schema.Entity('comments');
export const eventSchema = new schema.Entity('events', {
  pools: [poolSchema],
  comments: [commentSchema],
  waitingRegistrations: [registrationSchema]
});
export const eventAdministrateSchema = new schema.Entity('events', {
  pools: [poolSchema],
  unregistered: [registrationSchema],
  waitingRegistrations: [registrationSchema]
});
export const articleSchema = new schema.Entity('articles', {
  comments: [commentSchema],
  author: userSchema
});
export const galleryPictureSchema = new schema.Entity('pictures', {
  comments: [commentSchema]
});
export const gallerySchema = new schema.Entity('galleries', {
  pictures: [galleryPictureSchema]
});
export const quoteSchema = new schema.Entity('quotes', {
  comments: [commentSchema]
});
export const pageSchema = new schema.Entity(
  'pages',
  {},
  { idAttribute: 'slug' }
);
export const companyInterestSchema = new schema.Entity('companyInterest');
export const companySchema = new schema.Entity('companies', {
  studentContact: userSchema,
  comments: [commentSchema]
});
export const companySemesterSchema = new schema.Entity('companySemesters');
export const joblistingsSchema = new schema.Entity('joblistings');
export const announcementsSchema = new schema.Entity('announcements');
export const feedActivitySchema = new schema.Entity('feedActivities');
export const oauth2ApplicationSchema = new schema.Entity('oauth2Application');
export const oauth2GrantSchema = new schema.Entity('oauth2Grant');
export const membershipSchema = new schema.Entity('memberships', {
  user: userSchema
});
export const groupSchema = new schema.Entity('groups', {
  users: [userSchema]
});
export const meetingInvitationSchema = new schema.Entity(
  'meetingInvitations',
  {
    user: userSchema
  },
  {
    idAttribute: invite =>
      getMeetingInvitationId(invite.meeting, invite.user.username)
  }
);
export const meetingSchema = new schema.Entity('meetings', {
  invitations: [meetingInvitationSchema],
  reportAuthor: userSchema,
  createdBy: userSchema
});
