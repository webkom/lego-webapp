import loadable from '@loadable/component';
import pageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router-dom';

const InterestGroupList = loadable(
  () => import('./components/InterestGroupList'),
);
const InterestGroupInfo = loadable(
  () => import('./components/InterestGroupInfo'),
);
const InterestGroupMoneyApplication = loadable(
  () => import('./components/InterestGroupMoneyApplication'),
);
const InterestGroupCreateApplication = loadable(
  () => import('./components/InterestGroupApplyCreateApplication'),
);
const InterestGroupEdit = loadable(
  () => import('./components/InterestGroupEdit'),
);
const InterestGroupDetail = loadable(
  () => import('./components/InterestGroupDetail'),
);

const interestGroupsRoute: RouteObject[] = [
  { index: true, Component: InterestGroupList },
  { path: 'info', Component: InterestGroupInfo },
  { path: 'money-application', Component: InterestGroupMoneyApplication },
  { path: 'create-application', Component: InterestGroupCreateApplication },
  { path: 'create', Component: InterestGroupEdit },
  { path: ':groupId', Component: InterestGroupDetail },
  { path: ':groupId/edit', Component: InterestGroupEdit },
  { path: '*', children: pageNotFound },
];

export default interestGroupsRoute;
