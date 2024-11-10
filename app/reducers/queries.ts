import { createSlice } from '@reduxjs/toolkit';
import qs from 'qs';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from 'app/store/createRootReducer';

type SearchParams = {
  [key: string]: string;
};

type QueryState<Result> = {
  endpoint: string;
  searchParams: SearchParams;
  next?: string;
  previous?: string;
  isFetching: boolean;
} & (
  | {
      result: undefined;
      isPending: true;
      isError: false;
    }
  | {
      result: undefined;
      isPending: false;
      isError: true;
    }
  | {
      result: Result;
      isPending: false;
      isError: false;
    }
);

/// Sort object by key to ensure consistent key order
const sortObject = (obj: Record<string, string>) =>
  Object.entries(obj)
    .sort(([, a], [, b]) => a.localeCompare(b))
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

const createKey = (endpoint: string, searchParams: SearchParams) =>
  `${endpoint}?${qs.stringify(sortObject(searchParams))}`;

const querySlice = createSlice({
  name: 'queries',
  initialState: {
    queries: {} as {
      [key: string]: QueryState<unknown> | undefined;
    },
  },
  reducers: {
    updateQuery: (state, action: PayloadAction<QueryState<unknown>>) => {
      const key = createKey(
        action.payload.endpoint,
        action.payload.searchParams,
      );
      state.queries[key] = action.payload;
    },
  },
});
export default querySlice.reducer;
export const { updateQuery } = querySlice.actions;

export const selectQuery = (
  state: RootState,
  endpoint: string,
  searchParams: SearchParams,
) => {
  return (
    state.queries.queries[createKey(endpoint, searchParams)] ||
    ({
      endpoint,
      searchParams,
      result: undefined,
      isPending: true,
      isFetching: false,
      isError: false,
    } satisfies QueryState<unknown>)
  );
};
