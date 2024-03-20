import { createSlice } from '@reduxjs/toolkit';
import { OAuth2 } from 'app/actions/ActionTypes';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import type { RootState } from 'app/store/createRootReducer';

const legoAdapter = createLegoAdapter(EntityType.OAuth2Grants);

const oauth2GrantsSlice = createSlice({
  name: EntityType.OAuth2Grants,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [OAuth2.FETCH_GRANTS],
    deleteActions: [OAuth2.DELETE_GRANT],
  }),
});

export default oauth2GrantsSlice.reducer;

export const { selectAll: selectAllOAuth2Grants } = legoAdapter.getSelectors(
  (state: RootState) => state.oauth2Grants,
);
