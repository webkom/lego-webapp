import { push } from 'connected-react-router';
import { addToast } from 'app/reducers/toasts';
import type { ID } from 'app/store/models';
import Entities, { EntityType } from 'app/store/models/Entities';
import { quoteSchema } from 'app/store/schemas';
import createLegoApiAction from 'app/store/utils/createLegoApiAction';

interface FetchAllQuotesArgs {
  query?: Record<string, any>;
  next?: boolean;
}

export const fetchAll = createLegoApiAction()(
  'Quote.FETCH_ALL',
  (_, { query, next }: FetchAllQuotesArgs) => ({
    endpoint: '/quotes/',
    schema: [quoteSchema],
    query,
    pagination: {
      fetchNext: next,
    },
    meta: {
      errorMessage: 'Henting av sitater feilet',
    },
    propagateError: true,
  })
);

export const fetchQuote = createLegoApiAction()('Quote.FETCH', (_, id: ID) => ({
  endpoint: `/quotes/${id}/`,
  method: 'GET',
  meta: {
    id,
    errorMessage: 'Henting av quote feilet',
  },
  schema: quoteSchema,
  propagateError: true,
}));

interface FetchRandomQuoteSuccessPayload {
  result: ID;
  entities: Pick<Entities, EntityType.Quotes>;
}

export const fetchRandomQuote = createLegoApiAction<
  FetchRandomQuoteSuccessPayload,
  unknown
>()('Quote.FETCH_RANDOM', (_, seenQuotes: Array<ID> = []) => {
  const queryString = `?seen=[${String(seenQuotes)}]`;
  return {
    endpoint: `/quotes/random/${queryString}`,
    method: 'GET',
    meta: {
      queryString,
      errorMessage: 'Henting av tilfeldig quote feilet',
    },
    useCache: false,
    schema: quoteSchema,
  };
});

export const approve = createLegoApiAction()(
  'Quote.APPROVE',
  (_, quoteId: ID) => ({
    endpoint: `/quotes/${quoteId}/approve/`,
    method: 'PUT',
    meta: {
      errorMessage: 'Godkjenning av quote feilet',
      quoteId: Number(quoteId),
    },
  })
);

export const unapprove = createLegoApiAction()(
  'Quote.UNAPPROVE',
  (_, quoteId: ID) => ({
    endpoint: `/quotes/${quoteId}/unapprove/`,
    method: 'PUT',
    meta: {
      errorMessage: 'Underkjenning av quote feilet',
      quoteId: Number(quoteId),
    },
  })
);

interface AddQuoteArgs {
  text: string;
  source: string;
}

export const addQuotes = createLegoApiAction()(
  'Quote.ADD',
  (_, { text, source }: AddQuoteArgs) => ({
    endpoint: '/quotes/',
    method: 'POST',
    body: {
      text,
      source,
    },
    schema: quoteSchema,
    meta: {
      errorMessage: 'Legg til quote feilet',
    },
  }),
  {
    onSuccess: (_, dispatch) => {
      dispatch(push('/quotes'));
      dispatch(
        addToast({
          message:
            'Sitat sendt inn. Hvis det blir godkjent vil det dukke opp her!',
          dismissAfter: 10000,
        })
      );
    },
  }
);

export const deleteQuote = createLegoApiAction()(
  'Quote.DELETE',
  (_, id: ID) => ({
    endpoint: `/quotes/${id}/`,
    method: 'DELETE',
    meta: {
      id,
      errorMessage: 'Sletting av quote feilet',
    },
  })
);
