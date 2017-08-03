import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'photos',
  indexRoute: resolveAsyncRoute(
    () => import('./GalleryListRoute'),
    () => require('./GalleryListRoute')
  ),
  childRoutes: [
    {
      path: 'new',
      ...resolveAsyncRoute(
        () => import('./GalleryCreateRoute'),
        () => require('./GalleryCreateRoute')
      )
    },
    {
      path: ':galleryId/edit',
      ...resolveAsyncRoute(
        () => import('./GalleryEditRoute'),
        () => require('./GalleryEditRoute')
      )
    },
    {
      path: ':galleryId',
      ...resolveAsyncRoute(
        () => import('./GalleryDetailRoute'),
        () => require('./GalleryDetailRoute')
      ),
      childRoutes: [
        {
          path: 'picture/:pictureId',
          ...resolveAsyncRoute(
            () => import('./GalleryPictureRoute'),
            () => require('./GalleryPictureRoute')
          )
        }
      ]
    }
  ]
};
