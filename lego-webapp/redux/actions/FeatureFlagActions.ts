import { FeatureFlag as FeatureFlagAAT } from '~/redux/actionTypes';
import {
  AdminFeatureFlag,
  CreateFeatureFlag,
  EditFeatureFlag,
  PublicFeatureFlag,
} from '../models/FeatureFlag';
import { featureFlagSchema } from '../schemas';
import callAPI from './callAPI';
import type { EntityId } from '@reduxjs/toolkit';

export function fetchFeatureFlagByIdentifier(identifier: string) {
  return callAPI<PublicFeatureFlag>({
    types: FeatureFlagAAT.FETCH,
    schema: featureFlagSchema,
    endpoint: `/featureflags/${identifier}/`,
  });
}

export function fetchAdminFeatureFlag(id: EntityId) {
  return callAPI<AdminFeatureFlag>({
    types: FeatureFlagAAT.FETCH,
    schema: featureFlagSchema,
    endpoint: `/featureflags-admin/${id}/`,
  });
}

export function fetchAdminAllFeatureFlags() {
  return callAPI<AdminFeatureFlag[]>({
    types: FeatureFlagAAT.FETCH_ALL,
    schema: [featureFlagSchema],
    endpoint: `/featureflags-admin/`,
  });
}

export function createFeatureFlag(featureFlag: CreateFeatureFlag) {
  return callAPI<AdminFeatureFlag>({
    types: FeatureFlagAAT.CREATE,
    endpoint: '/featureflags-admin/',
    method: 'POST',
    schema: featureFlagSchema,
    body: featureFlag,
    meta: {
      errorMessage: 'Opprettelse av flagg feilet',
      successMessage: 'Opprettelse av flagg fullført',
    },
  });
}

export function editFeatureFlag(featureFlag: EditFeatureFlag, id: EntityId) {
  return callAPI<AdminFeatureFlag>({
    types: FeatureFlagAAT.EDIT,
    endpoint: `/featureflags-admin/${id}/`,
    method: 'PATCH',
    schema: featureFlagSchema,
    body: featureFlag,
    meta: {
      errorMessage: 'Endring av flagg feilet',
      successMessage: 'Endring av flagg fullført',
    },
  });
}

export function deleteFeatureFlag(id: EntityId) {
  return callAPI({
    types: FeatureFlagAAT.DELETE,
    endpoint: `/featureflags-admin/${id}/`,
    method: 'DELETE',
    meta: {
      id: id,
      errorMessage: 'Sletting av flagg feilet',
      successMessage: 'Sletting av flagg fullført',
    },
  });
}
