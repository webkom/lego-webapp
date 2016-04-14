import { Quote } from './ActionTypes';
import { callAPI } from '../utils/http';
import { push } from 'react-router-redux';
import { startSubmit, stopSubmit } from 'redux-form';

export function fetchAllApproved() {
  return callAPI({
    types: [
      Quote.FETCH_ALL_APPROVED_BEGIN,
      Quote.FETCH_ALL_APPROVED_SUCCESS,
      Quote.FETCH_ALL_APPROVED_FAILURE
    ],
    endpoint: '/quotes/'
  });
}

export function fetchAllUnapproved() {
  return callAPI({
    types: [
      Quote.FETCH_ALL_UNAPPROVED_BEGIN,
      Quote.FETCH_ALL_UNAPPROVED_SUCCESS,
      Quote.FETCH_ALL_UNAPPROVED_FAILURE
    ],
    endpoint: '/quotes/?approved=false'
  });
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
      quoteId
    }
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
    method: 'post'
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
    method: 'post'
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
    method: 'put'
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
    method: 'put'
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
        title: 'Tittel',
        text,
        source,
        approved: false
      }
    })).then(
      () => {
        dispatch(stopSubmit('addQuote'));
        dispatch(push('/quotes'));
      },
      (error) => {
        const errors = { ...error.response.body };
        if (errors.text) {
          errors.text = errors.text[0];
        }
        if (errors.source) {
          errors.source = errors.source[0];
        }
        dispatch(stopSubmit('addQuote', errors));
      }
    );
  };
}

export function deleter(quoteId) {
  return callAPI({
    types: [Quote.DELETE_BEGIN, Quote.DELETE_SUCCESS, Quote.DELETE_FAILURE],
    endpoint: `/quotes/${quoteId}/`,
    method: 'del',
    meta: {
      quoteId
    }
  });
}
