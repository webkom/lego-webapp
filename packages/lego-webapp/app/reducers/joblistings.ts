import { createSlice } from '@reduxjs/toolkit';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import { Joblistings } from '../actions/ActionTypes';
import type { EntityId } from '@reduxjs/toolkit';
import type { RootState } from 'app/store/createRootReducer';
import type { UnknownJoblisting } from 'app/store/models/Joblisting';

const legoAdapter = createLegoAdapter(EntityType.Joblistings);

export const joblistingsSlice = createSlice({
  name: EntityType.Joblistings,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [Joblistings.FETCH],
    deleteActions: [Joblistings.DELETE],
  }),
});

export default joblistingsSlice.reducer;

export const {
  selectAllPaginated: selectAllJoblistings,
  selectById: selectJoblistingById,
  selectByField: selectJoblistingsByField,
} = legoAdapter.getSelectors((state: RootState) => state.joblistings);

export const selectJoblistingBySlug = selectJoblistingsByField('slug').single;

export const selectJoblistingByIdOrSlug = <T extends UnknownJoblisting>(
  state: RootState,
  idOrSlug?: EntityId | string,
) =>
  selectJoblistingById<T>(state, idOrSlug) ||
  selectJoblistingBySlug<T>(state, String(idOrSlug));
