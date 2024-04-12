import { createSlice } from '@reduxjs/toolkit';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import { Penalty } from '../actions/ActionTypes';
import type { RootState } from 'app/store/createRootReducer';

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
