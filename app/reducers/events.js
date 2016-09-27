// @flow

import { Event } from '../actions/ActionTypes';
import { mutateComments } from 'app/reducers/comments';
import createEntityReducer from 'app/utils/createEntityReducer';

export type EventEntity = {
  id: number;
  name: string;
  comments: Array<number>;
};

const mutate = mutateComments('events');

export default createEntityReducer({
  key: 'events',
  types: [Event.FETCH.BEGIN, Event.FETCH.FAILURE, Event.FETCH.SUCCESS],
  mutate
});
