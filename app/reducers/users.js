import { User } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';

export type UserEntity = {
  username: string
};

export default createEntityReducer({
  key: 'users',
  types: [User.FETCH.BEGIN, User.FETCH.SUCCESS, User.FETCH.FAILURE]
});
