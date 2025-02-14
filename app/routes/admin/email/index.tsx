import { Navigate, type RouteObject } from 'react-router';
import { convert } from 'app/utils/convertRoute';
import pageNotFound from '../../pageNotFound';

const emailRoute: RouteObject[] = [
  {
    lazy: () => import('app/routes/admin_.email/route').then(convert),
    children: [
      { index: true, element: <Navigate to="lists" replace /> },
      {
        path: 'lists',
        lazy: () => import('app/routes/admin_.email.lists/route').then(convert),
      },
      {
        path: 'lists/new',
        lazy: () =>
          import('app/routes/admin_.email.lists.$emailListId/route').then(
            convert,
          ),
      },
      {
        path: 'lists/:emailListId',
        lazy: () =>
          import('app/routes/admin_.email.lists.$emailListId/route').then(
            convert,
          ),
      },
      {
        path: 'users',
        lazy: () => import('app/routes/admin_.email.users/route').then(convert),
      },
      {
        path: 'users/new',
        lazy: () =>
          import('app/routes/admin_.email.users_.$emailUserId/route').then(
            convert,
          ),
      },
      {
        path: 'users/:emailUserId',
        lazy: () =>
          import('app/routes/admin_.email.users_.$emailUserId/route').then(
            convert,
          ),
      },
      {
        path: 'restricted',
        lazy: () =>
          import('app/routes/admin_.email.restricted/route').then(convert),
      },
      {
        path: 'restricted/new',
        lazy: () =>
          import(
            'app/routes/admin_.email.restricted_.$restrictedMailId/route'
          ).then(convert),
      },
      {
        path: 'restricted/:restrictedMailId',
        lazy: () =>
          import(
            'app/routes/admin_.email.restricted_.$restrictedMailId/route'
          ).then(convert),
      },
    ],
  },
  { path: '*', children: pageNotFound },
];

export default emailRoute;
