// @flow

import { CompanyInterestForm } from './ActionTypes';
import callAPI from 'app/actions/callAPI';
import { addToast } from 'app/actions/ToastActions';
import { companyInterestSchema } from 'app/reducers';
import type { CompanyInterestEntity } from 'app/reducers/companyInterest';
import type { Thunk } from 'app/types';

export function fetchAll(): Thunk<any> {
  return callAPI({
    types: CompanyInterestForm.FETCH_ALL,
    endpoint: '/company-interests/',
    schema: [companyInterestSchema],
    meta: {
      errorMessage: 'Henting av bedriftsinteresser feilet',
    },
  });
}

export function fetchCompanyInterest(companyInterestId: number): Thunk<any> {
  return callAPI({
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
  isEnglish: boolean
): Thunk<*> {
  return (dispatch) => {
    return dispatch(
      callAPI({
        types: CompanyInterestForm.CREATE,
        endpoint: '/company-interests/',
        method: 'POST',
        schema: companyInterestSchema,
        body: data,
        meta: {
          errorMessage: 'Opprette bedriftsinteresse feilet',
        },
      })
    ).then(() =>
      dispatch(
        addToast({
          message: isEnglish
            ? 'Submission successful!'
            : 'Bedriftsinteresse opprettet!',
        })
      )
    );
  };
}

export function deleteCompanyInterest(id: number): Thunk<*> {
  return (dispatch) => {
    return dispatch(
      callAPI({
        types: CompanyInterestForm.DELETE,
        endpoint: `/company-interests/${id}/`,
        method: 'DELETE',
        meta: {
          id,
          errorMessage: 'Fjerning av bedriftsinteresse feilet!',
        },
      })
    ).then(() => dispatch(addToast({ message: 'Bedriftsinteresse fjernet!' })));
  };
}

export function updateCompanyInterest(
  id: number,
  data: CompanyInterestEntity
): Thunk<*> {
  return (dispatch) => {
    return dispatch(
      callAPI({
        types: CompanyInterestForm.UPDATE,
        endpoint: `/company-interests/${id}/`,
        method: 'PATCH',
        body: data,
        meta: {
          companyInterestId: id,
          errorMessage: 'Endring av bedriftsinteresse feilet!',
        },
      })
    ).then(() => dispatch(addToast({ message: 'Bedriftsinteresse endret!' })));
  };
}

export function fetch({
  next,
  filters,
}: { next: boolean, filters: Object } = {}): Thunk<*> {
  return (dispatch, getState) => {
    const cursor = next ? getState().companyInterest.pagination.next : {};

    return dispatch(
      callAPI({
        types: CompanyInterestForm.FETCH_ALL,
        endpoint: '/company-interests/',
        useCache: false,
        query: {
          ...cursor,
          ...filters,
        },
        schema: [companyInterestSchema],
        meta: {
          errorMessage: 'Henting av bedriftsinteresser feilet',
        },
        propagateError: true,
      })
    );
  };
}
