import loadable from '@loadable/component';
import { type RouteObject } from 'react-router-dom';

const BdbPage = loadable(() => import('./components/BdbPage'));
const CompanyEditor = loadable(() => import('./components/CompanyEditor'));
const BdbDetail = loadable(() => import('./components/BdbDetail'));
const AddSemester = loadable(() => import('./components/AddSemester'));
const CompanyContactEditor = loadable(
  () => import('./components/CompanyContactEditor'),
);
const PageNotFound = loadable(() => import('../pageNotFound'));

const BdbRoute: RouteObject[] = [
  { index: true, Component: BdbPage },
  { path: 'add', Component: CompanyEditor },
  { path: ':companyId', Component: BdbDetail },
  { path: ':companyId/edit', Component: CompanyEditor },
  { path: ':companyId/semesters/add', Component: AddSemester },
  { path: ':companyId/company-contacts/add', Component: CompanyContactEditor },
  {
    path: ':companyId/company-contacts/:companyContactId',
    Component: CompanyContactEditor,
  },
  { path: '*', element: <PageNotFound /> },
];

export default BdbRoute;
