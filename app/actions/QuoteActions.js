import { arrayOf } from 'normalizr';
import { push } from 'react-router-redux';
import { startSubmit, stopSubmit } from 'redux-form';
import { quoteSchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';
import { Quote } from './ActionTypes';

export function fetchAll({ approved = true }) {
  return callAPI({
    types: Quote.FETCH,
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
    types: Quote.FETCH,
    endpoint: `/quotes/${quoteId}/`,
    method: 'get',
    meta: {
      quoteId,
      errorMessage: 'Fetching quote failed'
    },
    schema: quoteSchema
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
    schema: arrayOf(quoteSchema)
  });
}

export function like(quoteId) {
  return callAPI({
    types: Quote.LIKE,
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
    types: Quote.UNLIKE,
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
    types: Quote.APPROVE,
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
    types: Quote.UNAPPROVE,
    endpoint: `/quotes/${quoteId}/unapprove/`,
    method: 'put',
    schema: quoteSchema,
    meta: {
      errorMessage: 'Unapproving quote failed'
    }
  });
}

export function addQuotes({ text, source }) {
  return (dispatch) => {
    dispatch(startSubmit('addQuote'));

    dispatch(callAPI({
      types: Quote.ADD,
      endpoint: '/quotes/',
      method: 'post',
      body: {
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
      quoteId,
      errorMessage: 'Deleting quote failed'
    },
    schema: quoteSchema
  });
}
