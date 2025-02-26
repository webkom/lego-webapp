import { createSlice } from '@reduxjs/toolkit';
import { OAuth2 } from '~/redux/actionTypes';
import createLegoAdapter from '~/redux/legoAdapter/createLegoAdapter';
import { EntityType } from '~/redux/models/entities';
import type { RootState } from '~/redux/rootReducer';

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
