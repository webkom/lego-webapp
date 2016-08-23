import { Schema, arrayOf } from 'normalizr';
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import companies from './companies';
import quotes from './quotes';
import events from './events';
import search from './search';
import auth from './auth';
import users from './users';
import groups from './groups';
import notifications from './notifications';
import comments from './comments';

export default combineReducers({
  companies,
  quotes,
  events,
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
export const commentSchema = new Schema('comments', { idAttribute: 'id' });
export const groupSchema = new Schema('groups', { idAttribute: 'id' });
export const userSchema = new Schema('users', { idAttribute: 'username' });
export const quoteSchema = new Schema('quotes', { idAttribute: 'id' });
export const companySchema = new Schema('companies', { idAttribute: 'id' });

eventSchema.define({
  comments: arrayOf(commentSchema)
});

groupSchema.define({
  users: arrayOf(userSchema)
});
