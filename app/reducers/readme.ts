//@flow
import { Readme } from 'app/actions/ActionTypes';

function mutateReadme(state: any, action: any) {
  switch (action.type) {
    case Readme.FETCH.SUCCESS:
      return action.payload;
    default:
      return state || [];
  }
}
export default mutateReadme;
