import { createSelector } from 'reselect';
import callAPI from 'app/actions/callAPI';
import { frontpageSchema } from 'app/reducers';
import {
  executeRequest,
  RequestStatus,
  selectRequest,
} from 'app/reducers/requests';
import { createAppAsyncThunk } from 'app/store/hooks';
import { createFetchHook } from 'app/store/utils/createFetchHook';
import { Frontpage } from './ActionTypes';
import type { Readme } from 'app/models';
import type { RootState } from 'app/store/createRootReducer';

const gql = String.raw;
export function fetchData() {
  return callAPI({
    types: Frontpage.FETCH,
    endpoint: '/frontpage/',
    schema: frontpageSchema,
    meta: {
      errorMessage: 'Klarte ikke hente forsiden!',
    },
    propagateError: true,
  });
}
const readmeUrl = 'https://readme-as-a-function.abakus.no/';
const readmeFragment = gql`
  fragment readmeFragment on ReadmeUtgave {
    title
    image
    pdf
    year
    utgave
  }
`;
const readmeUtgaver = gql`
  query readmeUtgaver($first: Int) {
    readmeUtgaver(first: $first) {
      ...readmeFragment
    }
  }
  ${readmeFragment}
`;

const fetchReadmes = createAppAsyncThunk(
  'readme/fetch',
  async (number: number, thunkAPI) => {
    const readmes = selectReadmes(thunkAPI.getState());
    await executeRequest(
      'readmes',
      async () => {
        const res = await fetch(readmeUrl, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            operationName: null,
            query: readmeUtgaver,
            variables: {
              first: number,
            },
          }),
        });
        const output = (await res.json()) as {
          data: { readmeUtgaver: Readme[] };
        };
        return output.data.readmeUtgaver;
      },
      thunkAPI,
      { forceFetch: readmes.length !== number },
    );
  },
);

const selectReadmes = createSelector(
  (state: RootState) => selectRequest<Readme[]>(state, 'readmes'),
  (request) => (request.status === RequestStatus.SUCCESS ? request.result : []),
);

export const useReadmes = createFetchHook(
  'fetchReadmes',
  fetchReadmes,
  selectReadmes,
);
