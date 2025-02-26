import { Emoji } from '~/redux/actionTypes';
import callAPI from '~/redux/actions/callAPI';
import { emojiSchema } from '~/redux/schemas';
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
