import loadable from '@loadable/component';
import pageNotFound from '../pageNotFound';
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

const interestGroupsRoute: RouteObject[] = [
  { index: true, Component: InterestGroupList },
  { path: 'create', Component: InterestGroupEdit },
  { path: ':groupId', Component: InterestGroupDetail },
  { path: ':groupId/edit', Component: InterestGroupEdit },
  { path: '*', children: pageNotFound },
];

export default interestGroupsRoute;
