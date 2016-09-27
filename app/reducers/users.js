import { User } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';

export default createEntityReducer({
  key: 'users',
  types: [User.FETCH.BEGIN, User.FETCH.SUCCESS, User.FETCH.FAILURE]
});
