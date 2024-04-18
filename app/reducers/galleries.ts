import { createSlice } from '@reduxjs/toolkit';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import { Gallery } from '../actions/ActionTypes';
import type { RootState } from 'app/store/createRootReducer';

export type GalleryEntity = {
  id: number;
  title: string;
  description: string;
  text?: string;
  comments?: Array<number>;
  cover?: Record<string, any>;
};

const legoAdapter = createLegoAdapter(EntityType.Galleries);
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
