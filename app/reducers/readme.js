//@flow
import { Readme } from 'app/actions/ActionTypes';
import produce from 'immer';

const mutateReadme = produce((newState: any, action: any): void => {
  switch (action.type) {
    case Readme.FETCH.SUCCESS:
      return action.payload;
  }
}, []);

export default mutateReadme;
