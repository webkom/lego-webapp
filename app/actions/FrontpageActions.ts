import { createAsyncThunk } from '@reduxjs/toolkit';
import type { ReadmeState } from 'app/reducers/readme';
import { frontpageSchema } from 'app/store/schemas';
import createLegoApiAction from 'app/store/utils/createLegoApiAction';

export const fetchData = createLegoApiAction()('Frontpage.FETCH', () => ({
  endpoint: '/frontpage/',
  schema: frontpageSchema,
  meta: {
    errorMessage: 'Klarte ikke hente forsiden!',
  },
  propagateError: true,
}));

const gql = String.raw;
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
  'Readme.FETCH',
  async (first: number): Promise<ReadmeState> => {
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
    return output.data.readmeUtgaver;
  }
);
