import type { CompanyInterestEntity } from 'app/reducers/companyInterest';
import { addToast } from 'app/reducers/toasts';
import { companyInterestSchema } from 'app/store/schemas';
import createLegoApiAction from 'app/store/utils/createLegoApiAction';

export const fetchAll = createLegoApiAction()(
  'CompanyInterestForm.FETCH_ALL',
  () => ({
    endpoint: '/company-interests/',
    schema: [companyInterestSchema],
    meta: {
      errorMessage: 'Henting av bedriftsinteresser feilet',
    },
  })
);

export const fetchCompanyInterest = createLegoApiAction()(
  'CompanyInterestForm.FETCH',
  (_, id: number) => ({
    endpoint: `/company-interests/${id}/`,
    schema: companyInterestSchema,
    meta: {
      errorMessage: 'Henting av bedriftsinteresse feilet',
    },
  })
);

export const createCompanyInterest = createLegoApiAction()(
  'CompanyInterestForm.CREATE',
  (_, data: CompanyInterestEntity, isEnglish: boolean) => ({
    endpoint: '/company-interests/',
    method: 'POST',
    schema: companyInterestSchema,
    body: data,
    meta: {
      isEnglish,
    },
  }),
  {
    onSuccess: (action, dispatch) => {
      dispatch(
        addToast({
          message: action.meta.isEnglish
            ? 'Company interest created'
            : 'Bedriftsinteresse opprettet',
        })
      );
    },
    onFailure: (action, dispatch) => {
      dispatch(
        addToast({
          message: action.meta.isEnglish
            ? 'Failed to create company interest'
            : 'Opprette bedriftsinteresse feilet',
        })
      );
    },
  }
);

export const deleteCompanyInterest = createLegoApiAction()(
  'CompanyInterestForm.DELETE',
  (_, id: number) => ({
    endpoint: `/company-interests/${id}/`,
    method: 'DELETE',
    meta: {
      id,
      successMessage: 'Bedriftsinteresse slettet',
      errorMessage: 'Fjerning av bedriftsinteresse feilet!',
    },
  })
);

export const updateCompanyInterest = createLegoApiAction()(
  'CompanyInterestForm.UPDATE',
  (_, id: number, data: CompanyInterestEntity) => ({
    endpoint: `/company-interests/${id}/`,
    method: 'PATCH',
    body: data,
    meta: {
      companyInterestId: id,
      successMessage: 'Bedriftsinteresse endret',
      errorMessage: 'Endring av bedriftsinteresse feilet!',
    },
  })
);

interface FetchCompanyInterestsArgs {
  next?: boolean;
  filters?: Record<string, any>;
}

export const fetch = createLegoApiAction()(
  'CompanyInterestForm.FETCH_ALL',
  ({ getState }, { next, filters }: FetchCompanyInterestsArgs = {}) => {
    const cursor = next ? getState().companyInterest.pagination.next : {};
    return {
      endpoint: '/company-interests/',
      useCache: false,
      query: { ...cursor, ...filters },
      schema: [companyInterestSchema],
      meta: {
        errorMessage: 'Henting av bedriftsinteresser feilet',
      },
      propagateError: true,
    };
  }
);
