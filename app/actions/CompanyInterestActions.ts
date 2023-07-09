import { addToast } from 'app/actions/ToastActions';
import callAPI from 'app/actions/callAPI';
import { companyInterestSchema } from 'app/reducers';
import type { CompanyInterestEntity } from 'app/reducers/companyInterest';
import type { RootState } from 'app/store/createRootReducer';
import type { Thunk } from 'app/types';
import { CompanyInterestForm } from './ActionTypes';

export function fetchCompanyInterest(
  companyInterestId: number
): Thunk<Promise<unknown>> {
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
): Thunk<Promise<unknown>> {
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
export function deleteCompanyInterest(id: number): Thunk<any> {
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
    ).then(() =>
      dispatch(
        addToast({
          message: 'Bedriftsinteresse fjernet!',
        })
      )
    );
  };
}
export function updateCompanyInterest(
  id: number,
  data: CompanyInterestEntity
): Thunk<Promise<unknown>> {
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
    ).then(() =>
      dispatch(
        addToast({
          message: 'Bedriftsinteresse endret!',
        })
      )
    );
  };
}
export function fetch({
  next = false,
  query,
}: {
  next?: boolean;
  query?: Record<string, string | number>;
} = {}): Thunk<Promise<unknown>> {
  return (dispatch, getState: () => RootState) => {
    return dispatch(
      callAPI({
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
      })
    );
  };
}
