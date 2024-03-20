import { produce } from 'immer';
import { Routing } from 'app/actions/ActionTypes';

export interface SummerPartyState {
  clickMe?: string;
}

const initialState: SummerPartyState = {
  clickMe:
    'https://webkom-sommerfest.s3.eu-west-2.amazonaws.com/faa664a97413100a.png',
};

const summerParty = produce((newState, action) => {
  switch (action.type) {
    case Routing.SET_STATUS_CODE:
      newState.clickMe = action.payload;
      break;

    default:
      break;
  }
}, initialState);

export default summerParty;
