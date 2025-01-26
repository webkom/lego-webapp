import loadable from '@loadable/component';
import {
  FilterSection,
  filterSidebar,
  LinkButton,
  Page,
} from '@webkom/lego-bricks';
import { Helmet } from 'react-helmet-async';
import { Outlet, useLocation, type RouteObject } from 'react-router-dom';
import { CheckBox } from 'app/components/Form';
import ToggleSwitch from 'app/components/Form/ToggleSwitch';
import { NavigationTab } from 'app/components/NavigationTab/NavigationTab';
import { contactStatuses, getStatusDisplayName } from 'app/routes/bdb/utils';
import useQuery from 'app/utils/useQuery';
import pageNotFound from '../pageNotFound';
import type { CompanySemesterContactStatus } from 'app/store/models/Company';

const bdbDefaultQuery = {
  show_inactive: '' as '' | 'true' | 'false',
  semesterStatus: [] as CompanySemesterContactStatus[],
};

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
  const isBdBPro = useLocation().pathname.includes('bdb-pro');

  const { query, setQueryValue } = useQuery(bdbDefaultQuery);

  const toggleSemesterStatus = (status: CompanySemesterContactStatus) => () => {
    setQueryValue('semesterStatus')(
      query.semesterStatus.includes(status)
        ? query.semesterStatus.filter((t) => t !== status)
        : [...query.semesterStatus, status],
    );
  };

  return (
    <Page
      sidebar={
        isBdBPro
          ? filterSidebar({
              children: (
                <>
                  <FilterSection title="Vis inaktive">
                    <ToggleSwitch
                      id="active"
                      checked={query.show_inactive === 'true'}
                      onChange={() =>
                        setQueryValue('show_inactive')(
                          query.show_inactive === 'true' ? 'false' : 'true',
                        )
                      }
                    />
                  </FilterSection>
                  <FilterSection title="Semesterstatus">
                    {contactStatuses.map((status) => (
                      <CheckBox
                        key={status}
                        id={status}
                        label={getStatusDisplayName(status)}
                        checked={query.semesterStatus.includes(status)}
                        onChange={toggleSemesterStatus(status)}
                      />
                    ))}
                  </FilterSection>
                </>
              ),
            })
          : undefined
      }
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
          <NavigationTab href="/bdb/bdb-pro">Semesterstatuser</NavigationTab>
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
      { path: 'bdb-pro', Component: BdbPage },
      { path: 'company-interest', Component: CompanyInterestList },
    ],
  },
  { path: 'add', Component: CompanyEditor },
  { path: ':companyId', Component: BdbDetail },
  { path: ':companyId/edit', Component: CompanyEditor },
  { path: ':companyId/semesters/add', Component: AddSemester },
  { path: ':companyId/student-contacts/edit', Component: StudentContactEditor },
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
