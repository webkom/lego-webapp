import { createSlice } from '@reduxjs/toolkit';
import { Joblistings } from '~/redux/actionTypes';
import createLegoAdapter from '~/redux/legoAdapter/createLegoAdapter';
import { EntityType } from '~/redux/models/entities';
import type { EntityId } from '@reduxjs/toolkit';
import type { UnknownJoblisting } from '~/redux/models/Joblisting';
import type { RootState } from '~/redux/rootReducer';

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
