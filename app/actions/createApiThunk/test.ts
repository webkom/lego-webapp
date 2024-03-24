import { createAsyncThunk } from '@reduxjs/toolkit';

const createThunk = <T>(a: T) =>
  createAsyncThunk<
    T,
    number,
    {
      fulfilledMeta: {
        test: 1;
      };
    }
  >('test', async (arg, { rejectWithValue }) => {
    return rejectWithValue(a);
  });
