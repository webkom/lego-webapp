import loadable from '@loadable/component';
import PageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router-dom';

const InterestGroupList = loadable(
  () => import('./components/InterestGroupList'),
);
const InterestGroupEdit = loadable(
  () => import('./components/InterestGroupEdit'),
);
const InterestGroupDetail = loadable(
  () => import('./components/InterestGroupDetail'),
);

const InterestGroupsRoute: RouteObject[] = [
  { index: true, Component: InterestGroupList },
  { path: 'create', Component: InterestGroupEdit },
  { path: ':groupId', Component: InterestGroupDetail },
  { path: ':groupId/edit', Component: InterestGroupEdit },
  { path: '*', children: PageNotFound },
];

export default InterestGroupsRoute;
