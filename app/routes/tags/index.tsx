
//
import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'tags',
  indexRoute: resolveAsyncRoute(() => import('./TagsListRoute')),
  childRoutes: [
    {
      path: ':tagId',
      ...resolveAsyncRoute(() => import('./TagDetailRoute'))
    }
  ]
};
