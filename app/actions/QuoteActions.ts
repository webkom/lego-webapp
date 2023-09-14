import { push } from 'redux-first-history';
import { startSubmit, stopSubmit } from 'redux-form';
import { addToast } from 'app/actions/ToastActions';
import callAPI from 'app/actions/callAPI';
import type { ID } from 'app/models';
import { quoteSchema } from 'app/reducers';
import type { Thunk } from 'app/types';
import { Quote } from './ActionTypes';

export function fetchAll({
  query,
  next = false,
}: {
  query?: Record<string, any>;
  next?: boolean;
} = {}): Thunk<any> {
  return callAPI({
    types: Quote.FETCH,
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
  });
}
export function fetchQuote(quoteId: number): Thunk<any> {
  return callAPI({
    types: Quote.FETCH,
    endpoint: `/quotes/${quoteId}/`,
    method: 'GET',
    meta: {
      quoteId,
      errorMessage: 'Henting av quote feilet',
    },
    schema: quoteSchema,
    propagateError: true,
  });
}
export function fetchRandomQuote(seenQuotes: Array<ID> = []) {
  const queryString = `?seen=[${String(seenQuotes)}]`;
  return callAPI({
    types: Quote.FETCH_RANDOM,
    endpoint: `/quotes/random/${queryString}`,
    method: 'GET',
    meta: {
      queryString,
      errorMessage: 'Henting av tilfeldig quote feilet',
    },
    schema: quoteSchema,
  });
}
export function approve(quoteId: number): Thunk<any> {
  return callAPI({
    types: Quote.APPROVE,
    endpoint: `/quotes/${quoteId}/approve/`,
    method: 'PUT',
    meta: {
      errorMessage: 'Godkjenning av quote feilet',
      quoteId: Number(quoteId),
    },
  });
}
export function unapprove(quoteId: number): Thunk<any> {
  return callAPI({
    types: Quote.UNAPPROVE,
    endpoint: `/quotes/${quoteId}/unapprove/`,
    method: 'PUT',
    meta: {
      errorMessage: 'Underkjenning av quote feilet',
      quoteId: Number(quoteId),
    },
  });
}
export function addQuotes({
  text,
  source,
}: {
  text: string;
  source: string;
}): Thunk<any> {
  return (dispatch) => {
    dispatch(startSubmit('addQuote'));
    return dispatch(
      callAPI({
        types: Quote.ADD,
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
      })
    ).then(() => {
      dispatch(stopSubmit('addQuote'));
      dispatch(push('/quotes'));
      dispatch(
        addToast({
          message:
            'Sitat sendt inn. Hvis det blir godkjent vil det dukke opp her!',
          dismissAfter: 10000,
        })
      );
    });
  };
}
export function deleteQuote(id: number): Thunk<any> {
  return callAPI({
    types: Quote.DELETE,
    endpoint: `/quotes/${id}/`,
    method: 'DELETE',
    meta: {
      id,
      errorMessage: 'Sletting av quote feilet',
    },
  });
}
