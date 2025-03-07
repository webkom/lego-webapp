import pageNotFound from 'app/routes/pageNotFound';
import { lazyComponent } from '~/utils/lazyComponent';
import type { RouteObject } from 'react-router';

const InterestGroupList = lazyComponent(() => import('./+Page'));
const InterestGroupInfo = lazyComponent(() => import('./info/+Page'));
const InterestGroupMoneyApplication = lazyComponent(
  () => import('./money-application/+Page'),
);
const InterestGroupCreateApplication = lazyComponent(
  () => import('./create-application/+Page'),
);
const InterestGroupEdit = lazyComponent(() => import('./InterestGroupEdit'));
const InterestGroupDetail = lazyComponent(
  () => import('~/pages/(migrated)/interest-groups/@groupId/+Page'),
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
