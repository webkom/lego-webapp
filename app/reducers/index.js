import { Schema, arrayOf } from 'normalizr';
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import quotes from './quotes';
import events from './events';
import pools from './pools';
import registrations from './registrations';
import search from './search';
import auth from './auth';
import users from './users';
import groups from './groups';
import notifications from './notifications';
import comments from './comments';

export default combineReducers({
  quotes,
  events,
  pools,
  registrations,
  search,
  comments,
  auth,
  form,
  users,
  groups,
  notifications,
  routing: routerReducer
});

export const eventSchema = new Schema('events', { idAttribute: 'id' });
export const poolSchema = new Schema('pools', { idAttribute: 'id' });
export const registrationSchema = new Schema('registrations', { idAttribute: 'id' });
export const commentSchema = new Schema('comments', { idAttribute: 'id' });
export const groupSchema = new Schema('groups', { idAttribute: 'id' });
export const userSchema = new Schema('users', { idAttribute: 'username' });
export const quoteSchema = new Schema('quotes', { idAttribute: 'id' });

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
