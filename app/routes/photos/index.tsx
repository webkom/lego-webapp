import loadable from '@loadable/component';
import pageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router-dom';

const Overview = loadable(() => import('./components/Overview'));
const GalleryEditor = loadable(() => import('./components/GalleryEditor'));
const GalleryDetail = loadable(() => import('./components/GalleryDetail'));
const GalleryPictureModal = loadable(
  () => import('./components/GalleryPictureModal'),
);
const GalleryPictureEditModal = loadable(
  () => import('./components/GalleryPictureEditModal'),
);

const photosRoute: RouteObject[] = [
  { index: true, Component: Overview },
  { path: 'new', Component: GalleryEditor },
  { path: ':galleryId', Component: GalleryDetail },
  { path: ':galleryId/edit', Component: GalleryEditor },
  { path: ':galleryId/picture/:pictureId', Component: GalleryPictureModal },
  {
    path: ':galleryId/picture/:pictureId/edit',
    Component: GalleryPictureEditModal,
  },
  { path: '*', children: pageNotFound },
];

export default photosRoute;
