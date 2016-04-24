import { Schema, arrayOf } from 'normalizr';

export { default as quotes } from './quotes';
export { default as events } from './events';
export { default as favorites } from './favorites';
export { default as search } from './search';
export { default as auth } from './auth';
export { reducer as form } from 'redux-form';
export { default as users } from './users';
export { default as groups } from './groups';
export { default as entities } from './entities';

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
