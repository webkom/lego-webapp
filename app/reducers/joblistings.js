import { Joblistings } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';

export default createEntityReducer({
  key: 'joblistings',
  types: {
    fetch: Joblistings.FETCH
  }
});
