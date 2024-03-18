import loadable from '@loadable/component';
import PageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router-dom';

const Contact = loadable(() => import('./components/Contact'));

const ContactRoute: RouteObject[] = [
  { index: true, Component: Contact },
  { path: '*', children: PageNotFound },
];

export default ContactRoute;
