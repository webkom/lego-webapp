import { Bdb } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';

export default createEntityReducer({
  key: 'companies',
  types: {
    fetch: Bdb.FETCH
  }
});
