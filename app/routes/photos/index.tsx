import { lazyComponent } from 'app/utils/lazyComponent';
import pageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router-dom';

const Overview = lazyComponent(() => import('./components/Overview'));
const GalleryEditor = lazyComponent(() => import('./components/GalleryEditor'));
const GalleryDetail = lazyComponent(() => import('./components/GalleryDetail'));
const GalleryPictureModal = lazyComponent(
  () => import('./components/GalleryPictureModal'),
);
const GalleryPictureEditForm = lazyComponent(
  () => import('./components/GalleryPictureEditForm'),
);

const photosRoute: RouteObject[] = [
  { index: true, lazy: Overview },
  { path: 'new', lazy: GalleryEditor },
  { path: ':galleryId/edit', lazy: GalleryEditor },
  {
    path: ':galleryId',
    lazy: GalleryDetail,
    children: [
      {
        path: 'picture/:pictureId',
        lazy: GalleryPictureModal,
        children: [
          {
            path: 'edit',
            lazy: GalleryPictureEditForm,
          },
        ],
      },
    ],
  },
  { path: '*', children: pageNotFound },
];

export default photosRoute;
