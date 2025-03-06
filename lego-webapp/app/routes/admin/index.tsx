import { lazyComponent } from '~/utils/lazyComponent';
import pageNotFound from '../pageNotFound';
import emailRoute from './email';
import groupPageRoute from './groups/components/groupPageRoute';
import type { RouteObject } from 'react-router';

const BannerOverview = lazyComponent(
  () => import('~/app/routes/hiddenAdmin/components/BannerOverview'),
);
const BannerEditor = lazyComponent(
  () => import('~/app/routes/hiddenAdmin/components/BannerEditor'),
);

const adminRoute: RouteObject[] = [
  { path: 'groups/:groupId/*', children: groupPageRoute },
  { path: 'groups', children: groupPageRoute },
  { path: 'email/*', children: emailRoute },
  { path: 'banners/', lazy: BannerOverview },
  { path: 'banners/create', lazy: BannerEditor },
  { path: 'banners/edit/:bannerId/', lazy: BannerEditor },
  { path: '*', children: pageNotFound },
];

export default adminRoute;
