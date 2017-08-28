// @flow

import { joblistingsSchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';
import { Joblistings } from './ActionTypes';
import { startSubmit, stopSubmit } from 'redux-form';
import { push } from 'react-router-redux';
import moment from 'moment';

export function fetchAll() {
  return callAPI({
    types: Joblistings.FETCH,
    endpoint: '/joblistings/',
    schema: [joblistingsSchema],
    meta: {
      errorMessage: 'Fetching joblistings failed'
    }
  });
}

export function fetchJoblisting(id) {
  return callAPI({
    types: Joblistings.FETCH,
    endpoint: `/joblistings/${id}/`,
    schema: joblistingsSchema,
    meta: {
      errorMessage: 'Fetching joblisting failed'
    }
  });
}

export function deleteJoblisting(id) {
  return dispatch => {
    dispatch(
      callAPI({
        types: Joblistings.DELETE,
        endpoint: `/joblistings/${id}/`,
        method: 'DELETE',
        meta: {
          id,
          errorMessage: 'Deleting joblisting failed'
        }
      })
    ).then(() => {
      dispatch(push('/joblistings/'));
    });
  };
}

export function createJoblisting({
  title,
  text,
  company,
  responsible,
  description,
  deadline,
  visibleFrom,
  visibleTo,
  jobType,
  workplaces,
  fromYear,
  toYear,
  applicationUrl
}) {
  return dispatch => {
    dispatch(startSubmit('joblistingEditor'));

    dispatch(
      callAPI({
        types: Joblistings.CREATE,
        endpoint: '/joblistings/',
        method: 'POST',
        body: {
          title,
          text,
          company: company && company.value,
          responsible,
          description,
          deadline: moment(deadline).toISOString(),
          visibleFrom: moment(visibleFrom).toISOString(),
          visibleTo: moment(visibleTo).toISOString(),
          jobType,
          workplaces,
          fromYear,
          toYear,
          applicationUrl
        },
        schema: joblistingsSchema,
        meta: {
          errorMessage: 'Creating joblisting failed'
        }
      })
    )
      .then(result => {
        const id = result.payload.result;
        dispatch(stopSubmit('joblistingEditor'));
        dispatch(push(`/joblistings/${id}`));
      })
      .catch(action => {
        const errors = { ...action.error.response.jsonData };
        dispatch(stopSubmit('joblistingEditor', errors));
      });
  };
}

export function editJoblisting({
  id,
  title,
  text,
  company,
  responsible,
  description,
  deadline,
  visibleFrom,
  visibleTo,
  jobType,
  workplaces,
  fromYear,
  toYear,
  applicationUrl
}) {
  return dispatch => {
    dispatch(startSubmit('joblistingEditor'));
    dispatch(
      callAPI({
        types: Joblistings.EDIT,
        endpoint: `/joblistings/${id}/`,
        method: 'put',
        body: {
          id,
          title,
          text,
          company: company && company.value,
          responsible,
          description,
          deadline: moment(deadline).toISOString(),
          visibleFrom: moment(visibleFrom).toISOString(),
          visibleTo: moment(visibleTo).toISOString(),
          jobType,
          workplaces,
          fromYear,
          toYear,
          applicationUrl
        },
        schema: joblistingsSchema,
        meta: {
          errorMessage: 'Editing joblisting failed'
        }
      })
    )
      .then(() => {
        dispatch(stopSubmit('joblistingEditor'));
        dispatch(push(`/joblistings/${id}`));
      })
      .catch(action => {
        const errors = { ...action.error.response.jsonData };
        dispatch(stopSubmit('joblistingEditor', errors));
      });
  };
}
