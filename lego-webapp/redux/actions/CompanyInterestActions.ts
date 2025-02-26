import { CompanyInterestForm } from '~/redux/actionTypes';
import callAPI from '~/redux/actions/callAPI';
import { companyInterestSchema } from '~/redux/schemas';
import type { EntityId } from '@reduxjs/toolkit';
import type { ParsedQs } from 'qs';
import type {
  DetailedCompanyInterest,
  ListCompanyInterest,
} from '~/redux/models/CompanyInterest';
import type { CompanyInterestEntity } from '~/redux/slices/companyInterest';

export const fetchAll = ({
  next = false,
  query,
}: {
  next?: boolean;
  query?: ParsedQs;
} = {}) =>
  callAPI<ListCompanyInterest[]>({
    types: CompanyInterestForm.FETCH_ALL,
    endpoint: '/company-interests/',
    query,
    pagination: {
      fetchNext: next,
    },
    schema: [companyInterestSchema],
    meta: {
      errorMessage: 'Henting av bedriftsinteresser feilet',
    },
    propagateError: true,
  });

export function fetchCompanyInterest(companyInterestId: EntityId) {
  return callAPI<DetailedCompanyInterest>({
    types: CompanyInterestForm.FETCH,
    endpoint: `/company-interests/${companyInterestId}/`,
    schema: companyInterestSchema,
    meta: {
      errorMessage: 'Henting av bedriftsinteresse feilet',
    },
  });
}

export function createCompanyInterest(
  data: CompanyInterestEntity,
  isEnglish: boolean,
) {
  return callAPI<DetailedCompanyInterest>({
    types: CompanyInterestForm.CREATE,
    endpoint: '/company-interests/',
    method: 'POST',
    schema: companyInterestSchema,
    body: data,
    meta: {
      successMessage: isEnglish
        ? 'Submission successful!'
        : 'Bedriftsinteresse opprettet!',
      errorMessage: 'Opprette bedriftsinteresse feilet',
    },
  });
}

export function deleteCompanyInterest(id: EntityId) {
  return callAPI({
    types: CompanyInterestForm.DELETE,
    endpoint: `/company-interests/${id}/`,
    method: 'DELETE',
    meta: {
      id,
      successMessage: 'Bedriftsinteresse fjernet!',
      errorMessage: 'Fjerning av bedriftsinteresse feilet!',
    },
  });
}

export function updateCompanyInterest(
  id: EntityId,
  data: CompanyInterestEntity,
) {
  return callAPI<DetailedCompanyInterest>({
    types: CompanyInterestForm.UPDATE,
    endpoint: `/company-interests/${id}/`,
    method: 'PATCH',
    body: data,
    meta: {
      companyInterestId: id,
      errorMessage: 'Endring av bedriftsinteresse feilet!',
      successMessage: 'Bedriftsinteresse endret!',
    },
  });
}
