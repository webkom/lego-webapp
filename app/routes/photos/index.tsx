import loadable from '@loadable/component';
import pageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router-dom';

const Overview = loadable(() => import('./components/Overview'));
const GalleryEditor = loadable(() => import('./components/GalleryEditor'));
const GalleryDetail = loadable(() => import('./components/GalleryDetail'));
const GalleryPictureModal = loadable(
  () => import('./components/GalleryPictureModal'),
);
const GalleryPictureEditForm = loadable(
  () => import('./components/GalleryPictureEditForm'),
);

const photosRoute: RouteObject[] = [
  { index: true, Component: Overview },
  { path: 'new', Component: GalleryEditor },
  { path: ':galleryId/edit', Component: GalleryEditor },
  {
    path: ':galleryId',
    Component: GalleryDetail,
    children: [
      {
        path: 'picture/:pictureId',
        Component: GalleryPictureModal,
        children: [
          {
            path: 'edit',
            Component: GalleryPictureEditForm,
          },
        ],
      },
    ],
  },
  { path: '*', children: pageNotFound },
];

export default photosRoute;
