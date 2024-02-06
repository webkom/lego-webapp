import moment from 'moment-timezone';
import callAPI from 'app/actions/callAPI';
import { joblistingsSchema } from 'app/reducers';
import { Joblistings } from './ActionTypes';
import type { ID } from 'app/store/models';
import type {
  DetailedJoblisting,
  ListJoblisting,
} from 'app/store/models/Joblisting';

export function fetchAll() {
  return callAPI<ListJoblisting>({
    types: Joblistings.FETCH,
    endpoint: '/joblistings/',
    schema: [joblistingsSchema],
    meta: {
      errorMessage: 'Henting av jobbannonser failet',
    },
    propagateError: true,
  });
}
export function fetchJoblisting(id: ID) {
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
export function deleteJoblisting(id: ID) {
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
