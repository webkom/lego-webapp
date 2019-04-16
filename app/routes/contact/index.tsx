

import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'contact',
  indexRoute: resolveAsyncRoute(() => import('./ContactRoute'))
};
