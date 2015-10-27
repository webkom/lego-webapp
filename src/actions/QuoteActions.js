import { Quotes } from './ActionTypes';
import { callAPI } from '../util/http';

export function fetchAllApproved() {
  return callAPI({
    type: Quotes.FETCH_ALL_APPROVED,
    endpoint: '/quotes/'
  });
}
export function fetchAllUnapproved() {
  return callAPI({
    type: Quotes.FETCH_ALL_UNAPPROVED,
    endpoint: '/quotes/unapproved/'
  });
}

export function like(quoteId) {
  return callAPI({
    type: Quotes.LIKE,
    endpoint: `/quotes/${quoteId}/like/`,
    method: 'post'
  });
}

export function unlike(quoteId) {
  return callAPI({
    type: Quotes.UNLIKE,
    endpoint: `/quotes/${quoteId}/unlike/`,
    method: 'post'
  });
}

export function approve(quoteId) {
  return callAPI({
    type: Quotes.APPROVE,
    endpoint: `/quotes/${quoteId}/approve/`,
    method: 'put'
  });
}

export function unapprove(quoteId) {
  return callAPI({
    type: Quotes.UNAPPROVE,
    endpoint: `/quotes/${quoteId}/unapprove/`,
    method: 'put'
  });
}

export function deleter(quoteId) {
  return callAPI({
    type: Quotes.DELETE,
    endpoint: `/quotes/${quoteId}/`,
    method: 'del',
    meta: {
      quoteId
    }
  });
}
