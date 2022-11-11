import { emojiSchema } from 'app/store/schemas';
import createLegoApiAction from 'app/store/utils/createLegoApiAction';

export const fetchEmoji = createLegoApiAction()(
  'Emoji.FETCH',
  (_, shortCode: string) => ({
    endpoint: `/emojis/${shortCode}/`,
    schema: emojiSchema,
    meta: {
      errorMessage: 'Henting av reaksjon feilet',
    },
    propagateError: true,
  })
);

export const fetchEmojis = createLegoApiAction()(
  'Emoji.FETCH_ALL',
  ({ getState }, { next = false }: { next?: boolean }) => {
    const cursor = next ? getState().emojis.pagination.next : {};
    return {
      endpoint: '/emojis/',
      schema: [emojiSchema],
      query: { ...cursor },
      meta: {
        errorMessage: 'Henting av emojis feilet',
      },
      propagateError: true,
    };
  }
);
