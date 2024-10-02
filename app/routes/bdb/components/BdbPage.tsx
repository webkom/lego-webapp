import { Card, Flex, Icon, LinkButton, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { MoveLeft, MoveRight } from 'lucide-react';
import moment from 'moment-timezone';
import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import {
  fetchAllAdmin,
  addSemesterStatus,
  editSemesterStatus,
  fetchSemesters,
} from 'app/actions/CompanyActions';
import Table, { ColumnProps } from 'app/components/Table';
import { selectTransformedAdminCompanies } from 'app/reducers/companies';
import { selectAllCompanySemesters } from 'app/reducers/companySemesters';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { Semester } from 'app/store/models';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import useQuery from 'app/utils/useQuery';
import { BdbTabs, getClosestCompanySemester, getSemesterStatus } from '../utils';
import SemesterStatus from './SemesterStatus';
import type { TransformedAdminCompany } from 'app/reducers/companies';
import type {
  AdminDetailCompany,
  AdminListCompany,
  CompanySemesterContactStatus,
} from 'app/store/models/Company';
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

  const currentCompanySemester = useMemo(() => {
    const semesterId = query.semester ?? getClosestCompanySemester(companySemesters);

    return companySemesters.find(
      (companySemester) => companySemester.id == semesterId,
    );
  }, [companySemesters, query]);

  const dispatch = useAppDispatch();
  usePreparedEffect(
    'fetchBdb',
    () =>
      dispatch(fetchSemesters()).then((action) => {
        const companySemesters = action.payload.entities.companySemesters;

        const semesterId = query.semester ?? getClosestCompanySemester(Object.values(companySemesters).filter(companySemester => companySemester !== undefined));

        return dispatch(fetchAllAdmin(semesterId!));
      }),
    [],
  );

  const editChangedStatuses = async (
    company: TransformedAdminCompany<AdminListCompany | AdminDetailCompany>,
    contactedStatus: CompanySemesterContactStatus[],
  ) => {
    if (!currentCompanySemester) {
      return;
    }

    const semesterStatus = {
      companyId: company.id,
      contactedStatus,
      semester: currentCompanySemester.id,
    };

    const semesterStatusId = getSemesterStatus(
      company,
      currentCompanySemester,
    )?.id;

    return semesterStatusId
      ? dispatch(editSemesterStatus({ ...semesterStatus, semesterStatusId }))
      : dispatch(addSemesterStatus(semesterStatus));
  };

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
          editChangedStatuses={editChangedStatuses}
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
      render: (_, { studentContact }) => {
        if (studentContact && typeof studentContact === 'object') {
          return (
            <Link to={`/users/${studentContact.username}`}>
              {studentContact.fullName}
            </Link>
          );
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
