import { Banner as BannerAAT } from '~/redux/actionTypes';
import { Banner, CreateBanner } from '../models/Banner';
import { bannerSchema } from '../schemas';
import callAPI from './callAPI';
import type { EntityId } from '@reduxjs/toolkit';

export function fetchCurrentPrivateBanner() {
  return callAPI<Banner>({
    types: BannerAAT.FETCH,
    schema: bannerSchema,
    endpoint: `/banners/current-private/`,
  });
}

export function fetchCurrentPublicBanner() {
  return callAPI<Banner>({
    types: BannerAAT.FETCH,
    schema: bannerSchema,
    endpoint: `/banners/current-public/`,
  });
}

export function fetchBannerById(id: EntityId) {
  return callAPI<Banner>({
    types: BannerAAT.FETCH,
    schema: bannerSchema,
    endpoint: `/banners/${id}/`,
  });
}

export function fetchAllBanners() {
  return callAPI({
    types: BannerAAT.FETCH,
    schema: [bannerSchema],
    endpoint: `/banners/`,
  });
}

export function createBanner(banner: CreateBanner) {
  return callAPI<Banner>({
    types: BannerAAT.CREATE,
    endpoint: '/banners/',
    method: 'POST',
    schema: bannerSchema,
    body: banner,
    meta: {
      errorMessage: 'Opprettelse av banner feilet',
      successMessage: 'Opprettelse av banner fullført',
    },
  });
}

export function editBanner(banner: CreateBanner, id: EntityId) {
  return callAPI<Banner>({
    types: BannerAAT.EDIT,
    endpoint: `/banners/${id}/`,
    method: 'PATCH',
    schema: bannerSchema,
    body: banner,
    meta: {
      errorMessage: 'Endring av banner feilet',
      successMessage: 'Endring av banner fullført',
    },
  });
}

export function deleteBanner(id: EntityId) {
  return callAPI({
    types: BannerAAT.DELETE,
    endpoint: `/banners/${id}/`,
    method: 'DELETE',
    meta: {
      id: id,
      errorMessage: 'Sletting av banner feilet',
      successMessage: 'Sletting av banner fullført',
    },
  });
}
