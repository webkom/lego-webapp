import loadable from '@loadable/component';
import type { RouteObject } from 'react-router-dom';

const HTTPError = loadable(() => import('app/routes/errors/HTTPError'));

const pageNotFound: RouteObject[] = [{ path: '*', Component: HTTPError }];

export default pageNotFound;
