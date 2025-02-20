import moment from 'moment-timezone';
import { Joblistings } from '~/redux/actionTypes';
import callAPI from '~/redux/actions/callAPI';
import { joblistingsSchema } from '~/redux/schemas';
import type { EntityId } from '@reduxjs/toolkit';
import type {
  DetailedJoblisting,
  ListJoblisting,
} from '~/redux/models/Joblisting';

export function fetchAll(query?: { company?: EntityId; timeFilter?: boolean }) {
  return callAPI<ListJoblisting[]>({
    types: Joblistings.FETCH,
    endpoint: '/joblistings/',
    query,
    schema: [joblistingsSchema],
    meta: {
      errorMessage: 'Henting av jobbannonser feilet',
    },
    propagateError: true,
  });
}

export function fetchJoblisting(id: EntityId) {
  return callAPI<DetailedJoblisting>({
    types: Joblistings.FETCH,
    endpoint: `/joblistings/${id}/`,
    schema: joblistingsSchema,
    meta: {
      errorMessage: 'Henting av jobbannonse feilet',
    },
    propagateError: true,
  });
}

export function deleteJoblisting(id: EntityId) {
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
}: Record<string, any>) {
  return callAPI<DetailedJoblisting>({
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
}: Record<string, any>) {
  return callAPI<DetailedJoblisting>({
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
    schema: joblistingsSchema,
    meta: {
      errorMessage: 'Endring av jobbannonse feilet',
    },
  });
}
