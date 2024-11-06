import { Card, Flex, LinkButton, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { fetchAllAdmin, fetchSemesters } from 'app/actions/CompanyActions';
import Table from 'app/components/Table';
import Tag from 'app/components/Tags/Tag';
import { selectTransformedAdminCompanies } from 'app/reducers/companies';
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
import styles from './bdb.module.css';
import type { ColumnProps } from 'app/components/Table';
import type CompanySemester from 'app/store/models/CompanySemester';
import type { UnknownUser } from 'app/store/models/User';

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
      title: 'Studentkontakt',
      dataIndex: 'studentContact',
      search: true,
      inlineFiltering: true,
      filterMapping: (studentContact: UnknownUser) => {
        if (studentContact && typeof studentContact === 'object') {
          return studentContact.fullName;
        }
      },
    },
    {
      title: 'Notat',
      dataIndex: 'comment',
      centered: false,
      maxWidth: 200,
      render: (_, company) => company.adminComment,
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

  const title = (
    <Flex gap="var(--spacing-sm)" alignItems="center">
      <h1>BDB</h1>
      <Tag className={styles.badge} tag="PRO" color="gray" />
    </Flex>
  );

  return (
    <Page
      title={title}
      actionButtons={<LinkButton href="/bdb/add">Ny bedrift</LinkButton>}
      tabs={<BdbTabs />}
    >
      <Helmet title="BDB" />

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
