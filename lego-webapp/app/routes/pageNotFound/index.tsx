import { lazyComponent } from '~/utils/lazyComponent';
import type { RouteObject } from 'react-router';

const HTTPError = lazyComponent(() => import('app/routes/errors/HTTPError'));

const pageNotFound: RouteObject[] = [{ path: '*', lazy: HTTPError }];

export default pageNotFound;
