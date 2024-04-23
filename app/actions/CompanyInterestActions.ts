import callAPI from 'app/actions/callAPI';
import { companyInterestSchema } from 'app/reducers';
import { addToast } from 'app/reducers/toasts';
import { CompanyInterestForm } from './ActionTypes';
import type { EntityId } from '@reduxjs/toolkit';
import type { CompanyInterestEntity } from 'app/reducers/companyInterest';
import type { AppDispatch } from 'app/store/createStore';
import type {
  DetailedCompanyInterest,
  ListCompanyInterest,
} from 'app/store/models/CompanyInterest';
import type { GetState } from 'app/types';

export function fetchAll() {
  return callAPI<ListCompanyInterest[]>({
    types: CompanyInterestForm.FETCH_ALL,
    endpoint: '/company-interests/',
    schema: [companyInterestSchema],
    meta: {
      errorMessage: 'Henting av bedriftsinteresser feilet',
    },
  });
}

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
  return (dispatch: AppDispatch) => {
    return dispatch(
      callAPI<DetailedCompanyInterest>({
        types: CompanyInterestForm.CREATE,
        endpoint: '/company-interests/',
        method: 'POST',
        schema: companyInterestSchema,
        body: data,
        meta: {
          errorMessage: 'Opprette bedriftsinteresse feilet',
        },
      }),
    ).then(() =>
      dispatch(
        addToast({
          message: isEnglish
            ? 'Submission successful!'
            : 'Bedriftsinteresse opprettet!',
        }),
      ),
    );
  };
}

export function deleteCompanyInterest(id: EntityId) {
  return (dispatch: AppDispatch) => {
    return dispatch(
      callAPI({
        types: CompanyInterestForm.DELETE,
        endpoint: `/company-interests/${id}/`,
        method: 'DELETE',
        meta: {
          id,
          errorMessage: 'Fjerning av bedriftsinteresse feilet!',
        },
      }),
    ).then(() =>
      dispatch(
        addToast({
          message: 'Bedriftsinteresse fjernet!',
        }),
      ),
    );
  };
}

export function updateCompanyInterest(
  id: EntityId,
  data: CompanyInterestEntity,
) {
  return (dispatch: AppDispatch) => {
    return dispatch(
      callAPI({
        types: CompanyInterestForm.UPDATE,
        endpoint: `/company-interests/${id}/`,
        method: 'PATCH',
        body: data,
        meta: {
          companyInterestId: id,
          errorMessage: 'Endring av bedriftsinteresse feilet!',
          successMessage: 'Bedriftsinteresse endret!',
        },
      }),
    );
  };
}

export function fetch({
  next,
  filters,
}: {
  next?: boolean;
  filters?: Record<string, string | number>;
} = {}) {
  return (dispatch: AppDispatch, getState: GetState) => {
    const cursor = next ? getState().companyInterest.pagination.next : {};
    return dispatch(
      callAPI<ListCompanyInterest[]>({
        types: CompanyInterestForm.FETCH_ALL,
        endpoint: '/company-interests/',
        query: { ...cursor, ...filters },
        schema: [companyInterestSchema],
        meta: {
          errorMessage: 'Henting av bedriftsinteresser feilet',
        },
        propagateError: true,
      }),
    );
  };
}
