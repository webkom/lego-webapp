import { createSlice } from '@reduxjs/toolkit';
import { OAuth2 } from 'app/actions/ActionTypes';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import type { RootState } from 'app/store/createRootReducer';

const legoAdapter = createLegoAdapter(EntityType.OAuth2Applications);

const oauth2ApplicationsSlice = createSlice({
  name: EntityType.OAuth2Applications,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [OAuth2.FETCH_APPLICATIONS, OAuth2.FETCH_APPLICATION],
  }),
});

export default oauth2ApplicationsSlice.reducer;

export const {
  selectAll: selectAllOAuth2Applications,
  selectById: selectOAuth2ApplicationById,
} = legoAdapter.getSelectors((state: RootState) => state.oauth2Applications);
