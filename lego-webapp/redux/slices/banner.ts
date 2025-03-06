import { createSlice } from '@reduxjs/toolkit';
import { Banner as BannerAAT } from '~/redux/actionTypes';
import createLegoAdapter from '~/redux/legoAdapter/createLegoAdapter';
import { EntityType } from '~/redux/models/entities';
import type { RootState } from '~/redux/rootReducer';

const legoAdapter = createLegoAdapter(EntityType.Banner);

const lendingRequestSlice = createSlice({
  name: EntityType.Banner,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [BannerAAT.FETCH],
    deleteActions: [BannerAAT.DELETE],
  }),
});

export default lendingRequestSlice.reducer;
export const {
  selectAllPaginated: selectAllBanners,
  selectById: selectBannerById,
  selectByField: selectBannersByField,
} = legoAdapter.getSelectors((state: RootState) => state.banner);
export const selectCurrentPrivateBanner =
  selectBannersByField('currentPrivate').single;
export const selectCurrentPublicBanner =
  selectBannersByField('currentPublic').single;
