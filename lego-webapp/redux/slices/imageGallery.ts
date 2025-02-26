import { createSlice } from '@reduxjs/toolkit';
import { ImageGallery, File } from '~/redux/actionTypes';
import createLegoAdapter from '~/redux/legoAdapter/createLegoAdapter';
import { EntityType } from '~/redux/models/entities';
import type { AnyAction } from 'redux';
import type { RootState } from '~/redux/rootReducer';

const legoAdapter = createLegoAdapter(EntityType.ImageGalleryEntries, {
  selectId: (entry) => entry.key,
});
const imageGalleryEntriesSlice = createSlice({
  name: EntityType.ImageGalleryEntries,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [ImageGallery.FETCH_ALL],
    extraCases: (addCase) => {
      addCase(File.PATCH.SUCCESS, (state, action: AnyAction) => {
        if (action.meta.body?.save_for_use === false) {
          state.ids = state.ids.filter((id) => id !== action.meta.id);
        }
      });
    },
  }),
});

export default imageGalleryEntriesSlice.reducer;
export const { selectAll: selectAllImageGalleryEntries } =
  legoAdapter.getSelectors((state: RootState) => state.imageGalleryEntries);
