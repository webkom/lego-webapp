import loadable from '@loadable/component';
import { type RouteObject } from 'react-router-dom';
import EmailRoute from './email';

// const EmailRoute = loadable(() => import('./email'));
const GroupPage = loadable(() => import('./groups/components/GroupPage'));
const PageNotFound = loadable(() => import('../pageNotFound'));

const AdminRoute: RouteObject[] = [
  { path: "groups/:groupId/*", Component: GroupPage },
  { path: "groups", Component: GroupPage },
  { path: "email/*", children: EmailRoute },
  { path: "*", Component: PageNotFound }
]

export default AdminRoute;
