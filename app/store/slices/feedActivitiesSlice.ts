import { Feed } from '../../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
export default createEntityReducer({
  key: 'feedActivities',
  types: {
    fetch: Feed.FETCH,
  },
});
