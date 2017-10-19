// @flow

import { push } from 'react-router-redux';
import { startSubmit, stopSubmit } from 'redux-form';
import { quoteSchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';
import { Quote } from './ActionTypes';
import { addNotification } from 'app/actions/NotificationActions';
import type { Thunk } from 'app/types';

export function fetchAll({
  approved = true,
  refresh = false,
  loadNextPage = false
}: {
  approved: boolean
}) {
  return callAPI({
    types: Quote.FETCH,
    endpoint: `/quotes/?approved=${String(approved)}`,
    schema: [quoteSchema],
    meta: {
      errorMessage: `Henting av ${approved ? '' : 'un'}godkjente quotes feilet`
    },
    propagateError: true
  });
}

export function fetchAllApproved() {
  return fetchAll({ approved: true });
}

export function fetchAllUnapproved() {
  return fetchAll({ approved: false });
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
