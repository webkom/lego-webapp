import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';
import { Gallery } from '~/redux/actionTypes';
import createLegoAdapter from '~/redux/legoAdapter/createLegoAdapter';
import { EntityType } from '~/redux/models/entities';
import type { RootState } from '~/redux/rootReducer';

const legoAdapter = createLegoAdapter(EntityType.Galleries, {
  sortComparer: (a, b) => moment(b.takenAt).diff(a.takenAt),
});
const galleriesSlice = createSlice({
  name: EntityType.Galleries,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [Gallery.FETCH],
    extraCases: (addCase) => {
      addCase(Gallery.UPLOAD.BEGIN, (state) => {
        state.fetching = true;
      });
      addCase(Gallery.UPLOAD.FAILURE, (state) => {
        state.fetching = false;
      });
      addCase(Gallery.UPLOAD.SUCCESS, (state) => {
        state.fetching = false;
      });
    },
  }),
});

export default galleriesSlice.reducer;
export const { selectAll: selectAllGalleries, selectById: selectGalleryById } =
  legoAdapter.getSelectors((state: RootState) => state.galleries);
