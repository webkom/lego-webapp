// @flow

import { schema } from 'normalizr';
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import routing from './routing';
import form from './forms';
import companies from './companies';
import quotes from './quotes';
import events from './events';
import articles from './articles';
import pools from './pools';
import registrations from './registrations';
import meetingsToken from './meetingsToken';
import meetings from './meetings';
import search from './search';
import auth from './auth';
import users from './users';
import groups from './groups';
import { oauth2Applications, oauth2Grants } from './oauth2';
import notifications from './notifications';
import notificationsFeed from './notificationsFeed';
import comments from './comments';
import pages from './pages';
import interestGroups from './interestGroups';
import joblistings from './joblistings';
import feedActivities from './feedActivities';
import feeds from './feeds';
import fetchHistory from './fetchHistory';
import { User } from '../actions/ActionTypes';
import type { State, Action } from 'app/types';

const reduceReducers = (...reducers) => (prev, curr) =>
  reducers.reduce((p, r) => r(p, curr), prev);

const reducers = {
  quotes,
  events,
  articles,
  pools,
  registrations,
  meetingsToken,
  meetings,
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
  notifications,
  notificationsFeed,
  routing: reduceReducers(routing, routerReducer),
  joblistings,
  feedActivities,
  feeds,
  fetchHistory,
  companies
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
  users: userSchema
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
  comments: [commentSchema]
});
export const meetingSchema = new schema.Entity('meetings');
export const groupSchema = new schema.Entity('groups', { users: [userSchema] });
export const quoteSchema = new schema.Entity('quotes');
export const pageSchema = new schema.Entity(
  'pages',
  {},
  { idAttribute: 'slug' }
);
export const interestGroupSchema = new schema.Entity('interestGroups');
export const companySchema = new schema.Entity('companies', {
  studentContact: userSchema
});
export const joblistingsSchema = new schema.Entity('joblistings');
export const feedActivitySchema = new schema.Entity('feedActivities');
export const oauth2ApplicationSchema = new schema.Entity('oauth2Application');
export const oauth2GrantSchema = new schema.Entity('oauth2Grant');
