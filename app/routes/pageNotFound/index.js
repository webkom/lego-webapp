import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: '*',
  ...resolveAsyncRoute(() => import('./PageNotFoundRoute'))
};
