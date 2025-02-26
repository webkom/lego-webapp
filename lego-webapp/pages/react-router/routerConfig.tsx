import { Outlet, RouteObject } from 'react-router';

const AppRoute = () => (
  <div>
    <p>Testing!!:)</p>
    <Outlet />
  </div>
);

export const routerConfig: RouteObject[] = [
  {
    Component: AppRoute,
    children: [
      {
        index: true,
        lazy: () =>
          import('./Counter').then(({ default: Component }) => ({ Component })),
      },
    ],
  },
];
