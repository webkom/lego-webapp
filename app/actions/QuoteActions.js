// @flow

import { push } from 'react-router-redux';
import { startSubmit, stopSubmit } from 'redux-form';
import { quoteSchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';
import { Quote } from './ActionTypes';
import { addNotification } from 'app/actions/NotificationActions';
import type { Thunk } from 'app/types';

const getEndpoint = (state, loadNextPage, queryString) => {
  const pagination = state.quotes.pagination;
  let endpoint = `/quotes/${queryString}`;
  if (loadNextPage && pagination.queryString === queryString) {
    endpoint = pagination.nextPage;
  }
  return endpoint;
};

export const fetchAll = ({
  approved = true,
  refresh = false,
  loadNextPage = false
}: {
  approved: boolean
}) => (dispatch, getState) => {
  const queryString = `?approved=${String(approved)}`;
  const endpoint = getEndpoint(getState(), loadNextPage, queryString);
  if (!endpoint) {
    return;
  }
  dispatch(
    callAPI({
      types: Quote.FETCH,
      endpoint,
      schema: [quoteSchema],
      meta: {
        queryString,
        errorMessage: `Henting av ${approved
          ? ''
          : 'ikke '}godkjente sitater feilet`
      },
      propagateError: true,
      cacheSeconds: Infinity // don't expire cache unless we pass force
    })
  );
};

export function fetchAllApproved(loadNextPage: boolean) {
  return fetchAll({ approved: true, loadNextPage });
}

export function fetchAllUnapproved(loadNextPage: boolean) {
  return fetchAll({ approved: false, loadNextPage });
}

export function fetchQuote(quoteId: number) {
  return callAPI({
    types: Quote.FETCH,
    endpoint: `/quotes/${quoteId}/`,
    method: 'GET',
    meta: {
      quoteId,
      errorMessage: 'Henting av quote feilet'
    },
    schema: quoteSchema,
    propagateError: true
  });
}

export function fetchRandomQuote() {
  return callAPI({
    types: Quote.FETCH,
    endpoint: '/quotes/random/',
    method: 'GET',
    meta: {
      errorMessage: 'Henting av tilfeldig quote feilet'
    },
    useCache: false,
    schema: quoteSchema
  });
}

export function approve(quoteId: number) {
  return callAPI({
    types: Quote.APPROVE,
    endpoint: `/quotes/${quoteId}/approve/`,
    method: 'PUT',
    meta: {
      errorMessage: 'Godkjenning av quote feilet',
      quoteId: Number(quoteId)
    }
  });
}

export function unapprove(quoteId: number) {
  return callAPI({
    types: Quote.UNAPPROVE,
    endpoint: `/quotes/${quoteId}/unapprove/`,
    method: 'PUT',
    meta: {
      errorMessage: 'Underkjenning av quote feilet',
      quoteId: Number(quoteId)
    }
  });
}

export function addQuotes({
  text,
  source
}: {
  text: string,
  source: string
}): Thunk<*> {
  return dispatch => {
    dispatch(startSubmit('addQuote'));

    return dispatch(
      callAPI({
        types: Quote.ADD,
        endpoint: '/quotes/',
        method: 'POST',
        body: {
          text,
          source
        },
        schema: quoteSchema,
        meta: {
          errorMessage: 'Legg til quote feilet'
        }
      })
    )
      .then(() => {
        dispatch(stopSubmit('addQuote'));
        dispatch(push('/quotes'));
        dispatch(
          addNotification({
            message:
              'Sitat sendt inn. Hvis det blir godkjent vil det dukke opp her!',
            dismissAfter: 10000
          })
        );
      })
      .catch(action => {
        const errors = { ...action.error.response.jsonData };
        dispatch(stopSubmit('addQuote', errors));
      });
  };
}

export function deleteQuote(quoteId: number) {
  return callAPI({
    types: Quote.DELETE,
    endpoint: `/quotes/${quoteId}/`,
    method: 'DELETE',
    meta: {
      quoteId: Number(quoteId),
      errorMessage: 'Sletting av quote feilet'
    }
  });
}
