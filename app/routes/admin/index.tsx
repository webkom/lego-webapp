import loadable from '@loadable/component';
import PageNotFound from '../pageNotFound';
import EmailRoute from './email';
import type { RouteObject } from 'react-router-dom';

const GroupPage = loadable(() => import('./groups/components/GroupPage'));

const AdminRoute: RouteObject[] = [
  { path: 'groups/:groupId/*', Component: GroupPage },
  { path: 'groups', Component: GroupPage },
  { path: 'email/*', children: EmailRoute },
  { path: '*', children: PageNotFound },
];

export default AdminRoute;
