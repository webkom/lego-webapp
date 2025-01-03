import callAPI from 'app/actions/callAPI';
import { frontpageSchema } from 'app/reducers';
import { executeRequest } from 'app/reducers/requests';
import { createAppAsyncThunk } from 'app/store/hooks';
import { createFetchHook } from 'app/store/utils/createFetchHook';
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

const createRequestThunk = <Returned, ThunkArg = void>(
  typePrefix: Parameters<typeof createAppAsyncThunk<Returned, ThunkArg>>[0],
  createRequestId: (arg: ThunkArg) => string,
  payloadCreator: (
    requestId: string,
    ...args: Parameters<
      Parameters<typeof createAppAsyncThunk<Returned, ThunkArg>>[1]
    >
  ) => ReturnType<
    Parameters<typeof createAppAsyncThunk<Returned, ThunkArg>>[1]
  >,
  thunkOptions?: Parameters<typeof createAppAsyncThunk<Returned, ThunkArg>>[2],
): RequestThunk<Returned, ThunkArg> => {
  return Object.assign(
    createAppAsyncThunk(
      typePrefix,
      (arg, thunkAPI) => payloadCreator(createRequestId(arg), arg, thunkAPI),
      thunkOptions,
    ),
    {
      createRequestId,
    },
  );
};

export type RequestThunk<Returned, Arg> = ReturnType<
  typeof createAppAsyncThunk<Returned, Arg>
> & {
  createRequestId: (arg: Arg) => string;
};

const fetchReadmes = createRequestThunk(
  'readme/fetch',
  (amount: number) => `readmes-${amount}`,
  async (requestId, amount, thunkAPI) => {
    return await executeRequest(
      requestId,
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
              first: amount,
            },
          }),
        });
        const output = (await res.json()) as {
          data: { readmeUtgaver: Readme[] };
        };
        return output.data.readmeUtgaver;
      },
      thunkAPI,
    );
  },
);

export const useReadmes = createFetchHook('fetchReadmes', fetchReadmes);
