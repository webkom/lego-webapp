import pageNotFound from 'app/routes/pageNotFound';
import { lazyComponent } from '~/utils/lazyComponent';
import type { RouteObject } from 'react-router';

const BannerOverview = lazyComponent(
  () => import('~/pages/(migrated)/admin/banners/+Page'),
);
const BannerEditor = lazyComponent(
  () => import('~/pages/(migrated)/admin/banners/BannerEditor'),
);

const adminRoute: RouteObject[] = [
  { path: 'banners/', lazy: BannerOverview },
  { path: 'banners/create', lazy: BannerEditor },
  { path: 'banners/edit/:bannerId/', lazy: BannerEditor },
  { path: '*', children: pageNotFound },
];

export default adminRoute;
