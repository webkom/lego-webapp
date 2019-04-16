import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'brand',
  indexRoute: resolveAsyncRoute(() => import('./components/BrandPage'))
};
