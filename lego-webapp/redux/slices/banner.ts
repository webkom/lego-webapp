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

const baseSelectors = legoAdapter.getSelectors(
  (state: RootState) => state.banner,
);

export const selectAllBanners = baseSelectors.selectAllPaginated;
export const selectBannerById = baseSelectors.selectById;

const selectBannersByFieldSafe = (field: string) => ({
  single: (state: RootState) => {
    const banners = baseSelectors.selectAllPaginated(state);
    const filtered = banners.filter(
      (banner) => banner && banner[field as keyof typeof banner] === true,
    );
    return filtered.length > 0 ? filtered[0] : undefined;
  },
});

export const selectBannersByField = baseSelectors.selectByField;
export const selectCurrentPrivateBanner =
  selectBannersByFieldSafe('currentPrivate').single;
export const selectCurrentPublicBanner =
  selectBannersByFieldSafe('currentPublic').single;
