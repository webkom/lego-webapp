import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'validator',
  ...resolveAsyncRoute(() => import('./ValidatorRoute'))
};
