import { arrayOf } from 'normalizr';
import { quoteSchema } from 'app/reducers';
import { Quote } from './ActionTypes';
import { callAPI } from '../utils/http';
import { push } from 'react-router-redux';
import { startSubmit, stopSubmit } from 'redux-form';

export function fetchAll({ approved = true }) {
  return callAPI({
    types: [
      Quote.FETCH_BEGIN,
      Quote.FETCH_SUCCESS,
      Quote.FETCH_FAILURE
    ],
    endpoint: `/quotes/?approved=${approved}`,
    schema: arrayOf(quoteSchema),
    meta: {
      errorMessage: `Fetching ${approved ? '' : 'un'}approved quotes failed`
    }
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
    types: [
      Quote.FETCH_BEGIN,
      Quote.FETCH_SUCCESS,
      Quote.FETCH_FAILURE
    ],
    endpoint: `/quotes/${quoteId}/`,
    method: 'get',
    meta: {
      quoteId,
      errorMessage: 'Fetching quote failed'
    },
    schema: quoteSchema
  });
}

export function like(quoteId) {
  return callAPI({
    types: [
      Quote.LIKE_BEGIN,
      Quote.LIKE_SUCCESS,
      Quote.LIKE_FAILURE
    ],
    endpoint: `/quotes/${quoteId}/like/`,
    method: 'post',
    schema: quoteSchema,
    meta: {
      errorMessage: 'Liking quote failed'
    }
  });
}

export function unlike(quoteId) {
  return callAPI({
    types: [
      Quote.UNLIKE_BEGIN,
      Quote.UNLIKE_SUCCESS,
      Quote.UNLIKE_FAILURE
    ],
    endpoint: `/quotes/${quoteId}/unlike/`,
    method: 'post',
    schema: quoteSchema,
    meta: {
      errorMessage: 'Unliking quote failed'
    }
  });
}

export function approve(quoteId) {
  return callAPI({
    types: [
      Quote.APPROVE_BEGIN,
      Quote.APPROVE_SUCCESS,
      Quote.APPROVE_FAILURE
    ],
    endpoint: `/quotes/${quoteId}/approve/`,
    method: 'put',
    schema: quoteSchema,
    meta: {
      errorMessage: 'Approving quote failed'
    }
  });
}

export function unapprove(quoteId) {
  return callAPI({
    types: [
      Quote.UNAPPROVE_BEGIN,
      Quote.UNAPPROVE_SUCCESS,
      Quote.UNAPPROVE_FAILURE
    ],
    endpoint: `/quotes/${quoteId}/unapprove/`,
    method: 'put',
    schema: quoteSchema,
    meta: {
      errorMessage: 'Unapproving quote failed'
    }
  });
}

export function addQuotes({ text, source }) {
  return (dispatch, getState) => {
    dispatch(startSubmit('addQuote'));

    dispatch(callAPI({
      types: [Quote.ADD_BEGIN, Quote.ADD_SUCCESS, Quote.ADD_FAILURE],
      endpoint: '/quotes/',
      method: 'post',
      body: {
        id: Date.now(),
        title: 'Tittel',
        text,
        source,
        approved: false
      },
      schema: quoteSchema,
      meta: {
        errorMessage: 'Adding quote failed'
      }
    })).then(() => {
      dispatch(stopSubmit('addQuote'));
      dispatch(push('/quotes'));
    }).catch((action) => {
      const errors = { ...action.error.response.body };
      if (errors.text) {
        errors.text = errors.text[0];
      }
      if (errors.source) {
        errors.source = errors.source[0];
      }
      dispatch(stopSubmit('addQuote', errors));
    });
  };
}

export function deleteQuote(quoteId) {
  return callAPI({
    types: [Quote.DELETE_BEGIN, Quote.DELETE_SUCCESS, Quote.DELETE_FAILURE],
    endpoint: `/quotes/${quoteId}/`,
    method: 'del',
    meta: {
      quoteId,
      errorMessage: 'Deleting quote failed'
    },
    schema: quoteSchema
  });
}
