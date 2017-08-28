// @flow

import { push } from 'react-router-redux';
import { startSubmit, stopSubmit } from 'redux-form';
import { quoteSchema } from 'app/reducers';
import isRequestNeeded from 'app/utils/isRequestNeeded';
import callAPI from 'app/actions/callAPI';
import { Quote } from './ActionTypes';

const reducerKey = 'quotes';

export function fetchAll({ approved = true }) {
  return callAPI({
    types: Quote.FETCH,
    endpoint: `/quotes/?approved=${approved}`,
    schema: [quoteSchema],
    meta: {
      errorMessage: `Fetching ${approved ? '' : 'un'}approved quotes failed`
    },
    isRequestNeeded: state => isRequestNeeded(state, reducerKey)
  });
}

export function fetchAllApproved() {
  return fetchAll({ approved: true });
}

export function fetchAllUnapproved() {
  return fetchAll({ approved: false });
}

export function fetchQuote(quoteId) {
  return callAPI({
    types: Quote.FETCH,
    endpoint: `/quotes/${quoteId}/`,
    method: 'get',
    meta: {
      quoteId,
      errorMessage: 'Fetching quote failed'
    },
    schema: quoteSchema,
    isRequestNeeded: state => isRequestNeeded(state, reducerKey, quoteId)
  });
}

export function fetchRandomQuote() {
  return callAPI({
    types: Quote.FETCH,
    endpoint: '/quotes/random/',
    method: 'get',
    meta: {
      errorMessage: 'Fetching random quote failed'
    },
    schema: quoteSchema
  });
}

export function approve(quoteId) {
  return callAPI({
    types: Quote.APPROVE,
    endpoint: `/quotes/${quoteId}/approve/`,
    method: 'put',
    meta: {
      errorMessage: 'Approving quote failed',
      quoteId: Number(quoteId)
    }
  });
}

export function unapprove(quoteId) {
  return callAPI({
    types: Quote.UNAPPROVE,
    endpoint: `/quotes/${quoteId}/unapprove/`,
    method: 'put',
    meta: {
      errorMessage: 'Unapproving quote failed',
      quoteId: Number(quoteId)
    }
  });
}

export function addQuotes({ text, source }) {
  return dispatch => {
    dispatch(startSubmit('addQuote'));

    dispatch(
      callAPI({
        types: Quote.ADD,
        endpoint: '/quotes/',
        method: 'post',
        body: {
          text,
          source
        },
        schema: quoteSchema,
        meta: {
          errorMessage: 'Adding quote failed'
        }
      })
    )
      .then(() => {
        dispatch(stopSubmit('addQuote'));
        dispatch(push('/quotes'));
      })
      .catch(action => {
        const errors = { ...action.error.response.jsonData };
        dispatch(stopSubmit('addQuote', errors));
      });
  };
}

export function deleteQuote(quoteId) {
  return callAPI({
    types: Quote.DELETE,
    endpoint: `/quotes/${quoteId}/`,
    method: 'delete',
    meta: {
      quoteId: Number(quoteId),
      errorMessage: 'Deleting quote failed'
    },
    schema: quoteSchema
  });
}
