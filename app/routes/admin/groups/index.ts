import { convert } from 'app/utils/convertRoute';
import type { RouteObject } from 'react-router';

const groupPageRoute: RouteObject[] = [
  {
    path: '*',
    lazy: () => import('../../admin_.groups/route').then(convert),
    children: [
      {
        path: 'settings',
        lazy: () =>
          import('app/routes/admin_.groups.$groupId.settings/route').then(
            convert,
          ),
      },
      {
        path: 'members',
        lazy: () =>
          import('app/routes/admin_.groups.$groupId.members/route').then(
            convert,
          ),
      },
      {
        path: 'permissions',
        lazy: () =>
          import('app/routes/admin_.groups.$groupId.permissions/route').then(
            convert,
          ),
      },
      {
        path: '*',
        lazy: () => import('../../admin_.groups._index/route').then(convert),
      },
    ],
  },
];

export default groupPageRoute;
