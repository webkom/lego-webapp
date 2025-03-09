import { usePreparedEffect } from '@webkom/react-prepare';
import { fetchFeatureFlagByIdentifier } from '~/redux/actions/FeatureFlagActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectFeatureFlagByIdentifier } from '~/redux/slices/featureFlags';

/**
 * Hook to check if a feature flag is enabled for the current user.
 * @param identifier - The feature flag identifier.
 * @returns {boolean} - Whether the feature flag is enabled (`true` or `false`).
 */
export const useFeatureFlag = (identifier: string): boolean => {
  const dispatch = useAppDispatch();
  const featureFlag = useAppSelector((state) =>
    selectFeatureFlagByIdentifier(state, identifier),
  );

  usePreparedEffect(
    'fetchFeatureFlagByIdentifier',
    () => {
      if (!featureFlag) {
        dispatch(fetchFeatureFlagByIdentifier(identifier));
      }
    },
    [dispatch, identifier, featureFlag],
  );

  return featureFlag?.canSeeFlag || false;
};
