import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'podcasts',
  indexRoute: resolveAsyncRoute(() => import('./PodcastListRoute')),
  childRoutes: [
    {
      path: 'create',
      ...resolveAsyncRoute(() => import('./PodcastCreateRoute'))
    },
    {
      path: ':podcastId/edit',
      ...resolveAsyncRoute(() => import('./PodcastEditRoute'))
    }
  ]
};
