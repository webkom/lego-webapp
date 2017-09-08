// @flow

import { Announcements } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';

export default createEntityReducer({
  key: 'announcements',
  types: {
    fetch: Announcements.FETCH_ALL
  }
});
