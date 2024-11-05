import { createSlice } from '@reduxjs/toolkit';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import { MeetingTemplates } from '../actions/ActionTypes';
import type { RootState } from 'app/store/createRootReducer';

const legoAdapter = createLegoAdapter(EntityType.MeetingTemplates);

const meetingTemplatesSlice = createSlice({
  name: EntityType.MeetingTemplates,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [MeetingTemplates.FETCH_ALL],
    deleteActions: [MeetingTemplates.DELETE],
  }),
});

export default meetingTemplatesSlice.reducer;
export const { selectAll: selectAllMeetingTemplates } =
  legoAdapter.getSelectors((state: RootState) => state.meetingTemplates);
