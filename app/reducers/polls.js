import createEntityReducer from '../utils/createEntityReducer';
import { Poll } from '../actions/ActionTypes';

export type PollEntity = {
  id: number,
  title: string,
  description: string,
  options: Array<OptionEntity>
};

type OptionEntity = {
  id: number,
  name: string,
  value: number
};

export default createEntityReducer({
  key: 'polls',
  types: {
    fetch: Poll.FETCH,
    mutate: Poll.CREATE
  },
  mutate(state, action) {
    switch (action.type) {
      case Poll.DELETE.SUCCESS:
        return {
          ...state,
          items: state.items.filter(id => action.meta.polls !== id)
        };
      default:
        return state;
    }
  }
});
