import callAPI from 'app/actions/callAPI';
import { frontpageSchema } from 'app/reducers';
import { Frontpage, Readme } from './ActionTypes';
import type { Thunk } from 'app/types';

const gql = String.raw;
export function fetchData(): Thunk<any> {
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
export function fetchReadmes(first: number) {
  return async (dispatch) => {
    try {
      dispatch({
        type: Readme.FETCH.BEGIN,
      });
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
            first,
          },
        }),
      });
      const output = await res.json();
      dispatch({
        type: Readme.FETCH.SUCCESS,
        payload: output.data.readmeUtgaver,
      });
    } catch (e) {
      //
    }
  };
}
