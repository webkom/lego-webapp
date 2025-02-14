import pageNotFound from '../pageNotFound';
import emailRoute from './email';
import groupPageRoute from './groups';
import type { RouteObject } from 'react-router';

const adminRoute: RouteObject[] = [
  { path: 'groups/:groupId/*', children: groupPageRoute },
  { path: 'groups', children: groupPageRoute },
  { path: 'email/*', children: emailRoute },
  { path: '*', children: pageNotFound },
];

export default adminRoute;
