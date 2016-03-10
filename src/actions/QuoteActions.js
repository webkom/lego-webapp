import { Quote } from './ActionTypes';
import request, { callAPI } from '../utils/http';
import { pushState } from 'redux-react-router';
import { startSubmit, stopSubmit } from 'redux-form';

export function fetchAllApproved() {
  return callAPI({
    type: Quote.FETCH_ALL_APPROVED,
    endpoint: '/quotes/'
  });
}

export function fetchAllUnapproved() {
  return callAPI({
    type: Quote.FETCH_ALL_UNAPPROVED,
    endpoint: '/quotes/?approved=false'
  });
}

export function fetchQuote(quoteId) {
  return callAPI({
    type: Quote.FETCH,
    endpoint: `/quotes/${quoteId}/`,
    method: 'get',
    meta: {
      quoteId
    }
  });
}

export function like(quoteId) {
  return callAPI({
    type: Quote.LIKE,
    endpoint: `/quotes/${quoteId}/like/`,
    method: 'post'
  });
}

export function unlike(quoteId) {
  return callAPI({
    type: Quote.UNLIKE,
    endpoint: `/quotes/${quoteId}/unlike/`,
    method: 'post'
  });
}

export function approve(quoteId) {
  return callAPI({
    type: Quote.APPROVE,
    endpoint: `/quotes/${quoteId}/approve/`,
    method: 'put'
  });
}

export function unapprove(quoteId) {
  return callAPI({
    type: Quote.UNAPPROVE,
    endpoint: `/quotes/${quoteId}/unapprove/`,
    method: 'put'
  });
}

export function addQuotes({ text, source }) {
  return (dispatch, getState) => {
    dispatch(startSubmit('addQuote'));
    const options = {
      url: `/quotes/`,
      method: 'post',
      body: {
        title: 'Tittel',
        text,
        source,
        approved: false
      },
      jwtToken: getState().auth.token
    };

    dispatch({
      promise: request(options),
      types: {
        begin: Quote.ADD_BEGIN,
        success: [
          Quote.ADD_SUCCESS,
          res => {
            dispatch(stopSubmit('addQuote'));
            dispatch(pushState(null, '/quotes'));
          }
        ],
        failure: [
          Quote.ADD_FAILURE,
          res => {
            const errors = { ...res.payload.response.body };
            if (errors.text) {
              errors.text = errors.text[0];
            }
            if (errors.source) {
              errors.source = errors.source[0];
            }
            dispatch(stopSubmit('addQuote', errors));
          }
        ]
      }
    });
  };
}

export function deleter(quoteId) {
  return callAPI({
    type: Quote.DELETE,
    endpoint: `/quotes/${quoteId}/`,
    method: 'del',
    meta: {
      quoteId
    }
  });
}
