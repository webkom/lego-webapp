import { lazyComponent } from 'app/utils/lazyComponent';
import pageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router';

const Contact = lazyComponent(() => import('./components/Contact'));

const contactRoute: RouteObject[] = [
  { index: true, lazy: Contact },
  { path: '*', children: pageNotFound },
];

export default contactRoute;
