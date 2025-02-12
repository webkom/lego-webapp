import { lazyComponent } from 'app/utils/lazyComponent';
import type { RouteObject } from 'react-router-dom';

const HTTPError = lazyComponent(() => import('app/routes/errors/HTTPError'));

const pageNotFound: RouteObject[] = [{ path: '*', lazy: HTTPError }];

export default pageNotFound;
