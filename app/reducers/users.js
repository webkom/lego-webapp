import { User } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';

export type UserEntity = {
  username: string
};

export default createEntityReducer({
  key: 'users',
  types: {
    fetch: User.FETCH
  }
});
