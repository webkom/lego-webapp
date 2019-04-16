

import callAPI from 'app/actions/callAPI';

import { Frontpage, Readme } from './ActionTypes';
import { frontpageSchema } from 'app/reducers';

const gql = String.raw;

export function fetchData() {
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

// $FlowFixMe
const readmeFragment = gql`
  fragment readmeFragment on ReadmeUtgave {
    title
    image
    pdf
    year
    utgave
  }
`;

// $FlowFixMe
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
      const res = await fetch(readmeUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          operationName: null,
          query: readmeUtgaver,
          variables: { first }
        })
      });

      const output = await res.json();
      dispatch({
        type: Readme.FETCH.SUCCESS,
        payload: output.data.readmeUtgaver
      });
    } catch (e) {
      //
    }
  };
}
