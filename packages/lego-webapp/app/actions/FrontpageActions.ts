import { createAsyncThunk } from '@reduxjs/toolkit';
import callAPI from 'app/actions/callAPI';
import { frontpageSchema } from 'app/reducers';
import { Frontpage } from './ActionTypes';
import type { Readme } from 'app/models';

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

export const fetchReadmes = createAsyncThunk(
  'readme/fetch',
  async (first: number) => {
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
    const output = (await res.json()) as { data: { readmeUtgaver: Readme[] } };
    return output.data.readmeUtgaver;
  },
);
