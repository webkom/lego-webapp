import { Schema, arrayOf } from 'normalizr';
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import quotes from './quotes';
import events from './events';
import favorites from './favorites';
import search from './search';
import auth from './auth';
import form from 'redux-form';
import users from './users';
import groups from './groups';
import notifications from './notifications';
import entities from './entities';

export default combineReducers({
  quotes,
  events,
  favorites,
  search,
  auth,
  form,
  users,
  groups,
  notifications,
  entities,
  routing: routerReducer
});

export const eventSchema = new Schema('events', { idAttribute: 'id' });
export const commentSchema = new Schema('comments', { idAttribute: 'id' });
export const groupSchema = new Schema('groups', { idAttribute: 'id' });
export const userSchema = new Schema('users', { idAttribute: 'username' });
export const quoteSchema = new Schema('quotes', { idAttribute: 'id' });

eventSchema.define({
  comments: arrayOf(commentSchema)
});

groupSchema.define({
  users: arrayOf(userSchema)
});
