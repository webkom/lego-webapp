import { Card, Flex, LinkButton, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { fetchAllAdmin, fetchSemesters } from 'app/actions/CompanyActions';
import Table from 'app/components/Table';
import {
  selectTransformedAdminCompanies,
  TransformedStudentCompanyContact,
} from 'app/reducers/companies';
import { selectAllCompanySemesters } from 'app/reducers/companySemesters';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import useQuery from 'app/utils/useQuery';
import {
  BdbTabs,
  getClosestCompanySemester,
  getCompanySemesterBySlug,
  getSemesterStatus,
} from '../utils';
import SemesterStatus from './SemesterStatus';
import type { ColumnProps } from 'app/components/Table';
import type CompanySemester from 'app/store/models/CompanySemester';
import UserLink from 'app/components/UserLink';

const companiesDefaultQuery = {
  active: '' as '' | 'true' | 'false',
  name: '',
  studentContact: '',
  semester: undefined,
};

const BdbPage = () => {
  const { query, setQuery } = useQuery(companiesDefaultQuery);

  const companies = useAppSelector(selectTransformedAdminCompanies);
  const companySemesters = useAppSelector(selectAllCompanySemesters);
  const fetching = useAppSelector((state) => state.companies.fetching);

  const resolveCurrentSemester = (
    slug: string | undefined,
    companySemesters: CompanySemester[],
  ) => {
    if (slug) {
      const companySemester = getCompanySemesterBySlug(slug, companySemesters);
      if (companySemester) return companySemester;
    }

    return getClosestCompanySemester(companySemesters);
  };

  const currentCompanySemester = useMemo(
    () => resolveCurrentSemester(query.semester, companySemesters),
    [companySemesters, query.semester],
  );

  const dispatch = useAppDispatch();
  usePreparedEffect(
    'fetchBdb',
    () =>
      dispatch(fetchSemesters()).then((action) => {
        const companySemesterEntities =
          action.payload.entities.companySemesters;
        const companySemesters = Object.values(companySemesterEntities).filter(
          (companySemester) => companySemester !== undefined,
        );

        const semester = resolveCurrentSemester(
          query.semester,
          companySemesters,
        );

        return dispatch(fetchAllAdmin(semester!.id));
      }),
    [],
  );

  const columns: ColumnProps<(typeof companies)[number]>[] = [
    {
      title: 'Bedrift',
      dataIndex: 'name',
      search: true,
      inlineFiltering: true,
      centered: false,
      render: (_, company) => (
        <Link to={`/bdb/${company.id}`}>{company.name}</Link>
      ),
    },
    {
      title: 'Status',
      dataIndex: `status`,
      padding: 0,
      render: (_, company) => (
        <SemesterStatus
          semesterStatus={
            currentCompanySemester &&
            getSemesterStatus(company, currentCompanySemester)
          }
          semester={
            currentCompanySemester && {
              semester: currentCompanySemester?.semester,
              year: currentCompanySemester.year,
            }
          }
          company={company}
        />
      ),
    },
    {
      title: 'Studentkontakter',
      dataIndex: 'studentContacts',
      search: true,
      inlineFiltering: true,
      filterMapping: (studentContacts: TransformedStudentCompanyContact[]) => {
        if (studentContacts && typeof studentContacts === 'object') {
          return studentContacts
            .map((studentContact) => studentContact.user.fullName)
            .join(' ');
        }
      },
      render: (_, { studentContacts }) =>
        studentContacts && (
          <Flex column gap="var(--spacing-sm)">
            {studentContacts.map((studentContact) => (
              <UserLink user={studentContact.user} />
            ))}
          </Flex>
        ),
    },
    {
      title: 'Notat',
      dataIndex: 'comment',
      centered: false,
      maxWidth: 200,
      sorter: (a, b) =>
        a.adminComment?.localeCompare(b.adminComment || '') || 0,

      // Using the last column for this filtering, even though it's unrelated
      filterIndex: 'active',
      filter: [
        { value: 'true', label: 'Aktiv' },
        { value: 'false', label: 'Inaktiv' },
      ],
    },
  ];

  const title = 'Bedriftsdatabase';

  return (
    <Page
      title={title}
      actionButtons={<LinkButton href="/bdb/add">Ny bedrift</LinkButton>}
      tabs={<BdbTabs />}
    >
      <Helmet title={title} />

      <Card severity="info">
        <Card.Header>Tips</Card.Header>
        Du kan endre semesterstatuser ved å trykke på dem i listen!
      </Card>

      <Table
        columns={columns}
        data={companies}
        filters={query}
        onChange={setQuery}
        loading={fetching}
        hasMore={false}
      />
    </Page>
  );
};

export default guardLogin(BdbPage);
