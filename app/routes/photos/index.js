import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'photos',
  indexRoute: resolveAsyncRoute(() => import('./GalleryListRoute')),
  childRoutes: [
    {
      path: 'new',
      ...resolveAsyncRoute(() => import('./GalleryCreateRoute'))
    },
    {
      path: ':galleryId/edit',
      ...resolveAsyncRoute(() => import('./GalleryEditRoute'))
    },
    {
      path: ':galleryId',
      ...resolveAsyncRoute(() => import('./GalleryDetailRoute')),
      childRoutes: [
        {
          path: 'picture/:pictureId/edit',
          ...resolveAsyncRoute(() => import('./GalleryPictureEditRoute'))
        },
        {
          path: 'picture/:pictureId',
          ...resolveAsyncRoute(() => import('./GalleryPictureRoute'))
        }
      ]
    }
  ]
};
