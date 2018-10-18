// @flow

import callAPI from 'app/actions/callAPI';
import { Frontpage, Readme } from './ActionTypes';
import { frontpageSchema } from 'app/reducers';

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

const readmeFragment = `
fragment readmeFragment on ReadmeUtgave {
    title
    image
    pdf
    year
    utgave
}

`;
//
//const latestReadme = `
//{
//    latestReadme{
//    ...readmeFragment
//    }
//
//}
//${readmeFragment}
//`;
//
const readmeUtgaver = `
query readmeUtgaver($first: Int){
    readmeUtgaver(first: $first){
    ...readmeFragment
    }

}
${readmeFragment}
`;

export function fetchReadmes() {
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
          variables: { first: 6 }
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
