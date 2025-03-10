import { createSelector, createSlice } from '@reduxjs/toolkit';
import { FeatureFlag as FeatureFlagAAT } from '~/redux/actionTypes';
import createLegoAdapter from '~/redux/legoAdapter/createLegoAdapter';
import { EntityType } from '~/redux/models/entities';
import { AdminFeatureFlag } from '../models/FeatureFlag';
import type { RootState } from '~/redux/rootReducer';

const legoAdapter = createLegoAdapter(EntityType.FeatureFlag);

const featureFlagSlice = createSlice({
  name: EntityType.FeatureFlag,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [FeatureFlagAAT.FETCH, FeatureFlagAAT.FETCH_ALL],
    deleteActions: [FeatureFlagAAT.DELETE],
  }),
});

export default featureFlagSlice.reducer;
export const {
  selectAllPaginated: selectAllFeatureFlags,
  selectById: selectFeatureFlagById,
  selectByField: selectFeatureFlagsByField,
} = legoAdapter.getSelectors((state: RootState) => state.featureFlags);
export const selectFeatureFlagByIdentifier =
  selectFeatureFlagsByField('identifier').single;

export const selectAllAdminFeatureFlags = createSelector(
  selectAllFeatureFlags,
  (featureFlags) => {
    if (!featureFlags) return [];
    return featureFlags as AdminFeatureFlag[];
  },
);

export const selectAdminFeatureFlagById = createSelector(
  selectFeatureFlagById,
  (featureFlag) => {
    if (!featureFlag) return null;
    return featureFlag as AdminFeatureFlag;
  },
);
