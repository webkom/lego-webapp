import loadable from '@loadable/component';
import pageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router-dom';

const Contact = loadable(() => import('./components/Contact'));

const contactRoute: RouteObject[] = [
  { index: true, Component: Contact },
  { path: '*', children: pageNotFound },
];

export default contactRoute;
