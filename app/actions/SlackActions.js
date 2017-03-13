// @flow
import callAPI from 'app/actions/callAPI';
import { Slack } from './ActionTypes';

export function inviteUser({ email }) {
  return (dispatch) => dispatch(callAPI({
    endpoint: '/slack/invite/',
    types: Slack.INVITE_USER,
    method: 'post',
    body: {
      email
    },
    meta: {
      email,
      errorMessage: 'Invite failed'
    }
  }));
}
