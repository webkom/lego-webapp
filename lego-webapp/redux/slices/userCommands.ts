import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../rootReducer';
import { UserCommand } from '~/redux/actionTypes';
import createLegoAdapter from '~/redux/legoAdapter/createLegoAdapter';
import { EntityType } from '~/redux/models/entities';


export type UserCommandEntity = {
  id: string;
  pinnedPosition: number | null;
  usageCount: number;
  lastUsed: string;
};


const legoAdapter = createLegoAdapter(EntityType.UserCommands);

const userCommandsSlice = createSlice({
  name: EntityType.UserCommands,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(UserCommand.FETCH_SUGGESTIONS.SUCCESS, (state, action) => {
      const entities = (action.payload.suggested ?? []).map((s: any) => ({
        id: s.commandId,                
        pinnedPosition: s.pinnedPosition,
        usageCount: s.usageCount,
        lastUsed: s.lastUsed,
      }));

      legoAdapter.setAll(state, entities);
    });
  },
});

export default userCommandsSlice.reducer;

export const {
  selectAll: selectAllUserCommands,
  selectById: selectUserCommandById,
} = legoAdapter.getSelectors((state: RootState) => state.userCommands);