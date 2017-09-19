import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'search',
  indexRoute: resolveAsyncRoute(() => import('./SearchRoute'))
};
