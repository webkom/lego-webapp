// @flow

import createEntityReducer from 'app/utils/createEntityReducer';
import { Feed } from '../actions/ActionTypes';

export default createEntityReducer({
  key: 'feedActivities',
  types: {
    fetch: Feed.FETCH,
  },
});
