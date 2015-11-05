import { Quote } from './ActionTypes';
import { callAPI } from '../utils/http';

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
