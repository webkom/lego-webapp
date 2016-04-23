import { arrayOf } from 'normalizr';
import { quoteSchema } from 'app/reducers';
import { Quote } from './ActionTypes';
import { callAPI } from '../utils/http';
import { push } from 'react-router-redux';
import { startSubmit, stopSubmit } from 'redux-form';
import { catchErrorAsNotification } from './NotificationActions';

export function fetchAll({ approved = true }) {
  return (dispatch) => {
    dispatch(callAPI({
      types: [
        Quote.FETCH_BEGIN,
        Quote.FETCH_SUCCESS,
        Quote.FETCH_FAILURE
      ],
      endpoint: `/quotes/?approved=${approved}`,
      schema: arrayOf(quoteSchema)
    }).catch(catchErrorAsNotification(dispatch,
      `Fetching ${approved ? '' : 'un'}approved quotes failed`)));
  };
}

export function fetchAllApproved() {
  return fetchAll({ approved: true });
}

export function fetchAllUnapproved() {
  return fetchAll({ approved: false });
}

export function fetchQuote(quoteId) {
  return (dispatch) => {
    dispatch(callAPI({
      types: [
        Quote.FETCH_BEGIN,
        Quote.FETCH_SUCCESS,
        Quote.FETCH_FAILURE
      ],
      endpoint: `/quotes/${quoteId}/`,
      method: 'get',
      meta: {
        quoteId
      },
      schema: quoteSchema
    })).catch(catchErrorAsNotification(dispatch, 'Fetching quote failed'));
  };
}

export function like(quoteId) {
  return (dispatch) => {
    dispatch(callAPI({
      types: [
        Quote.LIKE_BEGIN,
        Quote.LIKE_SUCCESS,
        Quote.LIKE_FAILURE
      ],
      endpoint: `/quotes/${quoteId}/like/`,
      method: 'post',
      schema: quoteSchema
    })).catch(catchErrorAsNotification(dispatch, 'Liking quote failed'));
  };
}

export function unlike(quoteId) {
  return (dispatch) => {
    dispatch(callAPI({
      types: [
        Quote.UNLIKE_BEGIN,
        Quote.UNLIKE_SUCCESS,
        Quote.UNLIKE_FAILURE
      ],
      endpoint: `/quotes/${quoteId}/unlike/`,
      method: 'post',
      schema: quoteSchema
    })).catch(catchErrorAsNotification(dispatch, 'Unliking quote failed'));
  };
}

export function approve(quoteId) {
  return (dispatch) => {
    dispatch(callAPI({
      types: [
        Quote.APPROVE_BEGIN,
        Quote.APPROVE_SUCCESS,
        Quote.APPROVE_FAILURE
      ],
      endpoint: `/quotes/${quoteId}/approve/`,
      method: 'put',
      schema: quoteSchema
    })).catch(catchErrorAsNotification(dispatch, 'Approving quote failed'));
  };
}

export function unapprove(quoteId) {
  return (dispatch) => {
    dispatch(callAPI({
      types: [
        Quote.UNAPPROVE_BEGIN,
        Quote.UNAPPROVE_SUCCESS,
        Quote.UNAPPROVE_FAILURE
      ],
      endpoint: `/quotes/${quoteId}/unapprove/`,
      method: 'put',
      schema: quoteSchema
    })).catch(catchErrorAsNotification(dispatch, 'Unapproving quote failed'));
  };
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
      schema: quoteSchema
    })).then(() => {
      dispatch(stopSubmit('addQuote'));
      dispatch(push('/quotes'));
    }).catch((action) => {
      catchErrorAsNotification(dispatch, 'Adding quote failed')(action);
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
  return (dispatch) => {
    dispatch(callAPI({
      types: [Quote.DELETE_BEGIN, Quote.DELETE_SUCCESS, Quote.DELETE_FAILURE],
      endpoint: `/quotes/${quoteId}/`,
      method: 'del',
      meta: {
        quoteId
      },
      schema: quoteSchema
    })).catch(catchErrorAsNotification(dispatch, 'Deleting quote failed'));
  };
}
