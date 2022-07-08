// @flow

import moment from 'moment-timezone';

import callAPI from 'app/actions/callAPI';
import { joblistingsSchema } from 'app/reducers';
import type { Thunk } from 'app/types';
import { Joblistings } from './ActionTypes';

export function fetchAll(): Thunk<any> {
  return callAPI({
    types: Joblistings.FETCH,
    endpoint: '/joblistings/',
    schema: [joblistingsSchema],
    meta: {
      errorMessage: 'Henting av jobbannonser failet',
    },
    propagateError: true,
  });
}

export function fetchJoblisting(id: number): Thunk<any> {
  return callAPI({
    types: Joblistings.FETCH,
    endpoint: `/joblistings/${id}/`,
    schema: joblistingsSchema,
    useCache: false,
    meta: {
      errorMessage: 'Henting av jobbannonse feilet',
    },
    propagateError: true,
  });
}

export function deleteJoblisting(id: number): Thunk<any> {
  return callAPI({
    types: Joblistings.DELETE,
    endpoint: `/joblistings/${id}/`,
    method: 'DELETE',
    meta: {
      id,
      errorMessage: 'Sletting av jobbannonse feilet',
    },
  });
}

export function createJoblisting({
  company,
  responsible,
  deadline,
  visibleTo,
  visibleFrom,
  ...data
}: Object): Thunk<any> {
  return callAPI({
    types: Joblistings.CREATE,
    endpoint: '/joblistings/',
    method: 'POST',
    body: {
      ...data,
      company: company && company.value,
      responsible: responsible && responsible.value,
      deadline: moment(deadline).toISOString(),
      visibleFrom: moment(visibleFrom).toISOString(),
      visibleTo: moment(visibleTo).toISOString(),
    },
    schema: joblistingsSchema,
    meta: {
      errorMessage: 'Opprettelse av jobbannonse feilet',
    },
  });
}

export function editJoblisting({
  id,
  company,
  responsible,
  deadline,
  visibleTo,
  visibleFrom,
  ...data
}: Object): Thunk<any> {
  return callAPI({
    types: Joblistings.EDIT,
    endpoint: `/joblistings/${id}/`,
    method: 'PUT',
    body: {
      ...data,
      company: company && company.value,
      responsible: responsible && responsible.value,
      deadline: moment(deadline).toISOString(),
      visibleFrom: moment(visibleFrom).toISOString(),
      visibleTo: moment(visibleTo).toISOString(),
    },
    meta: {
      errorMessage: 'Endring av jobbannonse feilet',
    },
  });
}
