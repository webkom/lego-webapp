import { lazyComponent } from '~/utils/lazyComponent';
import pageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router';

const HiddenAdmin = lazyComponent(() => import('./components/SudoAdmin'));

const hiddenAdminRoute: RouteObject[] = [
  { index: true, lazy: HiddenAdmin },
  { path: '*', children: pageNotFound },
];

export default hiddenAdminRoute;
