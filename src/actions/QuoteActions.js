import { Quote } from './ActionTypes';
import request, { callAPI } from '../utils/http';
import { pushState } from 'redux-react-router';

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

export function addQuotes(text, source) {
  return (dispatch, getState) => {
    const options = {
      url: `/quotes/`,
      method: 'post',
      body: {
        title: 'Tittel',
        text,
        source,
        approved: true
      },
      jwtToken: getState().auth.token
    };

    dispatch({
      promise: request(options),
      types: {
        begin: Quote.ADD_BEGIN,
        success: [
          Quote.ADD_SUCCESS,
          res => pushState(null, '/quotes')
        ],
        failure: Quote.ADD_FAILURE
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
