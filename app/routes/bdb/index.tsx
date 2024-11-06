import loadable from '@loadable/component';
import { LinkButton, Page } from '@webkom/lego-bricks';
import { Helmet } from 'react-helmet-async';
import { Outlet, useLocation, type RouteObject } from 'react-router-dom';
import { NavigationTab } from 'app/components/NavigationTab/NavigationTab';
import pageNotFound from '../pageNotFound';

const BdbPage = loadable(() => import('./components/BdbPage'));
const CompanyEditor = loadable(() => import('./components/CompanyEditor'));
const BdbDetail = loadable(() => import('./components/BdbDetail'));
const AddSemester = loadable(() => import('./components/AddSemester'));
const CompanyContactEditor = loadable(
  () => import('./components/CompanyContactEditor'),
);
const CompanyInterestList = loadable(
  () => import('./components/companyInterest/components/CompanyInterestList'),
);
const CompanyInterestPage = loadable(
  () => import('./components/companyInterest/components/CompanyInterestPage'),
);
const CompanySemesterGUI = loadable(
  () => import('./components/companyInterest/components/CompanySemesterGUI'),
);
const StudentContactEditor = loadable(
  () => import('./components/StudentContactEditor'),
);

const BdbOverview = () => {
  const isCompanyInterest = useLocation().pathname.includes('company-interest');

  return (
    <Page
      title="Bedriftsdatabase"
      actionButtons={
        isCompanyInterest ? (
          <LinkButton
            key="new-company-interest"
            href="/bdb/company-interest/create"
          >
            Ny bedriftsinteresse
          </LinkButton>
        ) : (
          <LinkButton key="new-company" href="/bdb/add">
            Ny bedrift
          </LinkButton>
        )
      }
      tabs={
        <>
          <NavigationTab href="/bdb">Semesterstatuser</NavigationTab>
          <NavigationTab href="/bdb/company-interest">
            Bedriftsinteresser
          </NavigationTab>
        </>
      }
    >
      <Helmet
        title={isCompanyInterest ? 'Bedriftsinteresser' : 'Semesterstatuser'}
      />
      <Outlet />
    </Page>
  );
};

const bdbRoute: RouteObject[] = [
  {
    path: '',
    Component: BdbOverview,
    children: [
      { index: true, Component: BdbPage },
      { path: 'company-interest', Component: CompanyInterestList },
    ],
  },
  { path: 'add', Component: CompanyEditor },
  { path: ':companyId', Component: BdbDetail },
  { path: ':companyId/edit', Component: CompanyEditor },
  { path: ':companyId/semesters/add', Component: AddSemester },
  { path: ':companyId/student-contacts/add', Component: StudentContactEditor },
  { path: ':companyId/company-contacts/add', Component: CompanyContactEditor },
  {
    path: ':companyId/company-contacts/:companyContactId',
    Component: CompanyContactEditor,
  },
  { path: 'company-interest', Component: CompanyInterestList },
  { path: 'company-interest/create', Component: CompanyInterestPage },
  { path: 'company-interest/semesters', Component: CompanySemesterGUI },
  {
    path: 'company-interest/:companyInterestId/edit',
    Component: CompanyInterestPage,
  },
  { path: '*', children: pageNotFound },
];

export default bdbRoute;
