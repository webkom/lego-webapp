import callAPI from "app/actions/callAPI";
import type { Thunk } from "app/types";
import { Frontpage, Readme } from "./ActionTypes";
import { frontpageSchema } from "app/reducers";
const gql = String.raw;
export function fetchData(): Thunk<any> {
  return callAPI({
    types: Frontpage.FETCH,
    endpoint: '/frontpage/',
    schema: frontpageSchema,
    meta: {
      errorMessage: 'Klarte ikke hente forsiden!'
    },
    propagateError: true
  });
}
const readmeUrl = 'https://readme-as-a-function.abakus.no/';
// @ts-expect-error
const readmeFragment = gql`
  fragment readmeFragment on ReadmeUtgave {
    title
    image
    pdf
    year
    utgave
  }
`;
// @ts-expect-error
const readmeUtgaver = gql`
  query readmeUtgaver($first: Int) {
    readmeUtgaver(first: $first) {
      ...readmeFragment
    }
  }
  ${readmeFragment}
`;
export function fetchReadmes(first: number) {
  // $FlowFixMe
  return async dispatch => {
    try {
      dispatch({
        type: Readme.FETCH.BEGIN
      });
      const res = await fetch(readmeUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          operationName: null,
          query: readmeUtgaver,
          variables: {
            first
          }
        })
      });
      const output = await res.json();
      dispatch({
        type: Readme.FETCH.SUCCESS,
        payload: output.data.readmeUtgaver
      });
    } catch (e) {//
    }
  };
}