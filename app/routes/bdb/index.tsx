import { type RouteObject } from 'react-router-dom';
import { lazyComponent } from 'app/utils/lazyComponent';
import pageNotFound from '../pageNotFound';

const BdbOverview = lazyComponent(() => import('./components/BdbOverview'));
const BdbPage = lazyComponent(() => import('./components/BdbPage'));
const CompanyEditor = lazyComponent(() => import('./components/CompanyEditor'));
const BdbDetail = lazyComponent(() => import('./components/BdbDetail'));
const AddSemester = lazyComponent(() => import('./components/AddSemester'));
const CompanyContactEditor = lazyComponent(
  () => import('./components/CompanyContactEditor'),
);
const CompanyInterestList = lazyComponent(
  () => import('./components/companyInterest/components/CompanyInterestList'),
);
const CompanyInterestPage = lazyComponent(
  () => import('./components/companyInterest/components/CompanyInterestPage'),
);
const CompanySemesterGUI = lazyComponent(
  () => import('./components/companyInterest/components/CompanySemesterGUI'),
);
const StudentContactEditor = lazyComponent(
  () => import('./components/StudentContactEditor'),
);

const bdbRoute: RouteObject[] = [
  {
    path: '',
    lazy: BdbOverview,
    children: [
      { index: true, lazy: BdbPage },
      { path: 'company-interest', lazy: CompanyInterestList },
    ],
  },
  { path: 'add', lazy: CompanyEditor },
  { path: ':companyId', lazy: BdbDetail },
  { path: ':companyId/edit', lazy: CompanyEditor },
  { path: ':companyId/semesters/add', lazy: AddSemester },
  { path: ':companyId/student-contacts/edit', lazy: StudentContactEditor },
  { path: ':companyId/company-contacts/add', lazy: CompanyContactEditor },
  {
    path: ':companyId/company-contacts/:companyContactId',
    lazy: CompanyContactEditor,
  },
  { path: 'company-interest', lazy: CompanyInterestList },
  { path: 'company-interest/create', lazy: CompanyInterestPage },
  { path: 'company-interest/semesters', lazy: CompanySemesterGUI },
  {
    path: 'company-interest/:companyInterestId/edit',
    lazy: CompanyInterestPage,
  },
  { path: '*', children: pageNotFound },
];

export default bdbRoute;
