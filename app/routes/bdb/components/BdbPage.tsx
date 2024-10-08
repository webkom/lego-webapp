import { Card, Flex, Icon, LinkButton, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { MoveLeft, MoveRight } from 'lucide-react';
import moment from 'moment-timezone';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import {
  fetchAllAdmin,
  addSemesterStatus,
  editSemesterStatus,
  fetchSemesters,
  addSemester,
} from 'app/actions/CompanyActions';
import Table from 'app/components/Table';
import { selectTransformedAdminCompanies } from 'app/reducers/companies';
import { selectAllCompanySemesters } from 'app/reducers/companySemesters';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { Semester } from 'app/store/models';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import useQuery from 'app/utils/useQuery';
import {
  indexToCompanySemester,
  indexToYearAndSemester,
  BdbTabs,
  selectMostProminentStatus,
  contactStatuses,
} from '../utils';
import SemesterStatus from './SemesterStatus';
import styles from './bdb.css';
import type { EntityId } from '@reduxjs/toolkit';
import type { ColumnProps } from 'app/components/Table';
import type { TransformedAdminCompany } from 'app/reducers/companies';
import type { CompanySemesterContactStatus } from 'app/store/models/Company';
import type { UnknownUser } from 'app/store/models/User';

const companiesDefaultQuery = {
  active: '' as '' | 'true' | 'false',
  name: '',
  studentContact: '',
};

const NUMBER_OF_SEMESTERS = 3;

const BdbPage = () => {
  const { query, setQuery } = useQuery(companiesDefaultQuery);

  const [startYear, setStartYear] = useState(moment().year());
  const [startSemester, setStartSemester] = useState(
    moment().month() > 6 ? 1 : 0,
  );

  const companies = useAppSelector(selectTransformedAdminCompanies);
  const companySemesters = useAppSelector(selectAllCompanySemesters);
  const fetching = useAppSelector((state) => state.companies.fetching);

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchBdb',
    () => dispatch(fetchSemesters()).then(() => dispatch(fetchAllAdmin())),
    [],
  );

  const navigateThroughTime = (options: {
    direction: 'forward' | 'backward';
  }) => {
    let newYear: number;
    if (options.direction === 'forward') {
      newYear = startSemester === 0 ? startYear : startYear + 1;
    } else {
      newYear = startSemester === 1 ? startYear : startYear - 1;
    }
    setStartYear(newYear);

    const newSemester = (startSemester + 1) % (NUMBER_OF_SEMESTERS - 1);
    setStartSemester(newSemester);
  };

  const navigate = useNavigate();

  const editChangedStatuses = async (
    companyId: EntityId,
    tableIndex: number,
    semesterStatusId: EntityId | undefined,
    contactedStatus: CompanySemesterContactStatus[],
  ) => {
    // Update state whenever a semesterStatus is graphically changed by the user
    const companySemester = indexToCompanySemester(
      tableIndex,
      startYear,
      startSemester,
      companySemesters,
    );

    let companySemesterId: EntityId;

    if (!companySemester) {
      const newCompanySemester = indexToYearAndSemester(
        tableIndex,
        startYear,
        startSemester,
      );
      const response = await dispatch(addSemester(newCompanySemester));
      companySemesterId = response.payload.result;
    } else {
      companySemesterId = companySemester.id;
    }

    const semesterStatus = {
      companyId,
      contactedStatus,
      semester: companySemesterId,
    };
    return semesterStatusId
      ? dispatch(editSemesterStatus({ ...semesterStatus, semesterStatusId }))
      : dispatch(addSemesterStatus(semesterStatus)).then(() => {
          navigate('/bdb');
        });
  };

  const semesterTitle = (index: number) => {
    const result = indexToYearAndSemester(index, startYear, startSemester);
    const semester = result.semester === Semester.Spring ? 'Vår' : 'Høst';

    return (
      <Flex alignItems="center" gap="var(--spacing-sm)">
        {index === 0 && (
          <Icon
            onClick={() => navigateThroughTime({ direction: 'backward' })}
            iconNode={<MoveLeft />}
            className={styles.navigateThroughTime}
          />
        )}
        <span>
          {semester} {result.year}
        </span>
        {index === NUMBER_OF_SEMESTERS - 1 && (
          <Icon
            onClick={() => navigateThroughTime({ direction: 'forward' })}
            iconNode={<MoveRight />}
            className={styles.navigateThroughTime}
          />
        )}
      </Flex>
    );
  };

  const semesterElement = (index: number, company: TransformedAdminCompany) => {
    const result = indexToYearAndSemester(index, startYear, startSemester);
    return (company.semesterStatuses || []).find(
      (status) =>
        status.year === result.year && status.semester === result.semester,
    );
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
    ...Array.from({ length: NUMBER_OF_SEMESTERS }, (_, index) => ({
      title: semesterTitle(index),
      dataIndex: `semester-${index}`,
      sorter: (a, b) => {
        const { year, semester } = indexToYearAndSemester(
          index,
          startYear,
          startSemester,
        );
        const semesterA = a.semesterStatuses?.find(
          (obj) => obj.year === year && obj.semester === semester,
        );
        const statusA = selectMostProminentStatus(semesterA?.contactedStatus);
        const semesterB = b.semesterStatuses?.find(
          (obj) => obj.year === year && obj.semester === semester,
        );
        const statusB = selectMostProminentStatus(semesterB?.contactedStatus);

        if (statusA === statusB) {
          return a.name.localeCompare(b.name);
        }

        return (
          contactStatuses.indexOf(statusA) - contactStatuses.indexOf(statusB)
        );
      },
      padding: 0,
      render: (_, company) => (
        <SemesterStatus
          semIndex={index}
          semesterStatus={semesterElement(index, company)}
          editChangedStatuses={editChangedStatuses}
          companyId={company.id}
        />
      ),
    })),
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
      // Using an empty column for filtering
      title: '',
      dataIndex: 'Filter',
      centered: false,
      maxWidth: 50,
      render: () => '',
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
