import { Schema, arrayOf } from 'normalizr';
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import form from './forms';
import quotes from './quotes';
import events from './events';
import articles from './articles';
import pools from './pools';
import registrations from './registrations';
import meetings from './meetings';
import search from './search';
import auth from './auth';
import users from './users';
import groups from './groups';
import notifications from './notifications';
import comments from './comments';
import pages from './pages';
import interestGroups from './interestGroups';

export default combineReducers({
  quotes,
  events,
  articles,
  pools,
  registrations,
  meetings,
  interestGroups,
  search,
  comments,
  auth,
  form,
  users,
  groups,
  pages,
  notifications,
  routing
});

export const articleSchema = new Schema('articles', { idAttribute: 'id' });
export const eventSchema = new Schema('events', { idAttribute: 'id' });
export const poolSchema = new Schema('pools', { idAttribute: 'id' });
export const registrationSchema = new Schema('registrations', { idAttribute: 'id' });
export const meetingSchema = new Schema('meetings', { idAttribute: 'id' });
export const commentSchema = new Schema('comments', { idAttribute: 'id' });
export const groupSchema = new Schema('groups', { idAttribute: 'id' });
export const userSchema = new Schema('users', { idAttribute: 'username' });
export const quoteSchema = new Schema('quotes', { idAttribute: 'id' });
export const pageSchema = new Schema('pages', { idAttribute: 'slug' });
export const interestGroupSchema = new Schema('interestGroups', { idAttribute: 'id' });

eventSchema.define({
  pools: arrayOf(poolSchema),
  comments: arrayOf(commentSchema)
});

poolSchema.define({
  registrations: arrayOf(registrationSchema)
});

registrationSchema.define({
  users: userSchema
});

groupSchema.define({
  users: arrayOf(userSchema)
});
