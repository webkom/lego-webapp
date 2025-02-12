import { lazyComponent } from 'app/utils/lazyComponent';
import pageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router-dom';

const InterestGroupList = lazyComponent(
  () => import('./components/InterestGroupList'),
);
const InterestGroupInfo = lazyComponent(
  () => import('./components/InterestGroupInfo'),
);
const InterestGroupMoneyApplication = lazyComponent(
  () => import('./components/InterestGroupMoneyApplication'),
);
const InterestGroupCreateApplication = lazyComponent(
  () => import('./components/InterestGroupApplyCreateApplication'),
);
const InterestGroupEdit = lazyComponent(
  () => import('./components/InterestGroupEdit'),
);
const InterestGroupDetail = lazyComponent(
  () => import('./components/InterestGroupDetail'),
);

const interestGroupsRoute: RouteObject[] = [
  { index: true, lazy: InterestGroupList },
  { path: 'info', lazy: InterestGroupInfo },
  { path: 'money-application', lazy: InterestGroupMoneyApplication },
  { path: 'create-application', lazy: InterestGroupCreateApplication },
  { path: 'create', lazy: InterestGroupEdit },
  { path: ':groupId', lazy: InterestGroupDetail },
  { path: ':groupId/edit', lazy: InterestGroupEdit },
  { path: '*', children: pageNotFound },
];

export default interestGroupsRoute;
