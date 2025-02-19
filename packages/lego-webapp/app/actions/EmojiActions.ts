import callAPI from 'app/actions/callAPI';
import { emojiSchema } from 'app/reducers';
import { Emoji } from './ActionTypes';
import type { Thunk } from 'app/types';

export function fetchEmojis(): Thunk<any> {
  return (dispatch) => {
    return dispatch(
      callAPI({
        types: Emoji.FETCH_ALL,
        endpoint: '/emojis/',
        schema: [emojiSchema],
        meta: {
          errorMessage: 'Henting av emojis feilet',
        },
        propagateError: true,
      }),
    );
  };
}
