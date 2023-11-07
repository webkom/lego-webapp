import callAPI from 'app/actions/callAPI';
import { emojiSchema } from 'app/reducers';
import { Emoji } from './ActionTypes';
import type { Thunk } from 'app/types';

export function fetchEmoji(shortCode: string): Thunk<any> {
  return callAPI({
    types: Emoji.FETCH,
    endpoint: `/emojis/${shortCode}/`,
    schema: emojiSchema,
    meta: {
      errorMessage: 'Henting av reaksjon feilet',
    },
    propagateError: true,
  });
}
export function fetchEmojis({
  next = false,
}: {
  next?: boolean;
} = {}): Thunk<any> {
  return (dispatch, getState) => {
    const cursor = next ? getState().emojis.pagination.next : {};
    return dispatch(
      callAPI({
        types: Emoji.FETCH_ALL,
        endpoint: '/emojis/',
        schema: [emojiSchema],
        query: { ...cursor },
        meta: {
          errorMessage: 'Henting av emojis feilet',
        },
        propagateError: true,
      })
    );
  };
}
