import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'podcasts',
  indexRoute: resolveAsyncRoute(() => import('./PodcastRoute')),
  childRoutes: [
    {
      path: 'edit',
      ...resolveAsyncRoute(() => import('./PodcastEditorRoute'))
    },
    {
      path: ':podcastId',
      ...resolveAsyncRoute(() => import('./PodcastDetailRoute'))
    }
  ]
};
