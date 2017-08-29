import { Meeting } from '../actions/ActionTypes';
const initialState = {
  response: '',
  user: {},
  meeting: null,
  status: '',
  lastFetched: null
};

type State = typeof initialState;

export default function meetingsToken(
  state: State = initialState,
  action: Action
) {
  switch (action.type) {
    case Meeting.ANSWER_INVITATION_TOKEN.FAILURE: {
      return { status: 'bad' };
    }
    case Meeting.ANSWER_INVITATION_TOKEN.SUCCESS: {
      console.log('meetingtokenreducer', action.payload);
      const { meeting, user, status } = action.payload;

      return {
        ...action.payload,
        response: 'good',
        user,
        meeting,
        status,
        lastFetched: Date.now()
      };
    }
    default:
      return state;
  }
}
