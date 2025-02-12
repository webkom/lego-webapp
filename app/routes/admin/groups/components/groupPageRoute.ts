import { lazyComponent } from 'app/utils/lazyComponent';
import type { RouteObject } from 'react-router-dom';

const GroupForm = lazyComponent(() => import('./GroupForm'));
const GroupMembers = lazyComponent(() => import('./GroupMembers'));
const GroupPermissions = lazyComponent(() => import('./GroupPermissions'));
const GroupPage = lazyComponent(() => import('./GroupPage'));
const SelectGroup = lazyComponent(() => import('./SelectGroup'));

const groupPageRoute: RouteObject[] = [
  {
    path: '*',
    lazy: GroupPage,
    children: [
      { path: 'settings', lazy: GroupForm },
      { path: 'members', lazy: GroupMembers },
      { path: 'permissions', lazy: GroupPermissions },
      { path: '*', lazy: SelectGroup },
    ],
  },
];

export default groupPageRoute;
