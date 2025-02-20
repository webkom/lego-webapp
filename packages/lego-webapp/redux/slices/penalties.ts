import { createSlice } from '@reduxjs/toolkit';
import { Penalty } from '~/redux/actionTypes';
import createLegoAdapter from '~/redux/legoAdapter/createLegoAdapter';
import { EntityType } from '~/redux/models/entities';
import type { RootState } from '~/redux/rootReducer';

const legoAdapter = createLegoAdapter(EntityType.Penalties);

const penaltiesSlice = createSlice({
  name: EntityType.Penalties,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [Penalty.FETCH],
    deleteActions: [Penalty.DELETE],
  }),
});

export default penaltiesSlice.reducer;
export const { selectByField: selectPenaltiesByField } =
  legoAdapter.getSelectors((state: RootState) => state.penalties);

export const selectPenaltyByUserId = selectPenaltiesByField('user');
