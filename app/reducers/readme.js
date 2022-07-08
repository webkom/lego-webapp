//@flow
import { produce } from 'immer';

import { Readme } from 'app/actions/ActionTypes';

const mutateReadme = produce<any>((newState: any, action: any): void => {
  switch (action.type) {
    case Readme.FETCH.SUCCESS:
      return action.payload;
    default:
      break;
  }
}, []);

export default mutateReadme;
