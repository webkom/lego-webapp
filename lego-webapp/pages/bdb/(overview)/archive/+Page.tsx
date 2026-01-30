import { Card, Flex, Icon, CheckBox } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import cx from 'classnames';
import { ChevronLeft, ChevronRight, Briefcase, Clock } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ContentMain } from '~/components/Content';
import { SelectInput } from '~/components/Form';
import Table from '~/components/Table';
import { fetchAllAdmin, fetchSemesters } from '~/redux/actions/CompanyActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { EntityType } from '~/redux/models/entities';
import { selectTransformedAdminCompanies } from '~/redux/slices/companies';
import { selectAllCompanySemesters } from '~/redux/slices/companySemesters';
import { selectPaginationNext } from '~/redux/slices/selectors';
import { guardLogin } from '~/utils/replaceUnlessLoggedIn';
import useQuery from '~/utils/useQuery';
import {
  getCompanySemesterBySlug,
  getClosestCompanySemester,
  getSemesterSlugById,
  getSemesterSlugOffset,
  semesterToHumanReadable,
} from '../../utils';
import styles from '../CompanyColors.module.css';
import type { ColumnProps } from '~/components/Table';
import type CompanySemester from '~/redux/models/CompanySemester';

// --- Configuration ---

const companiesDefaultQuery = {
  active: '' as '' | 'true' | 'false',
  name: '',
  studentContacts: '',
  semester: '',
  search: '',
  status: '',
};

const JOB_TYPES = ['Sommerjobb', 'Fulltid', 'Deltid', 'Graduate', 'Masteroppgave'];

// --- Types ---
type JobListing = {
  id: string;
  type: string;
  date: Date;
};

type CompanyProfile = {
  eventCount: number;
  activeListings: JobListing[];
  expiredListings: JobListing[];
};

// --- Mock Data Generator ---

/**
 * Helper to generate a random date within a range (days ago)
 */
const getDateDaysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * days));
  return date;
};

const generateCompanyProfile = (): CompanyProfile => {
  const hasEvents = Math.random() > 0.8;
  const hasActiveJobs = Math.random() > 0.5;
  const hasExpiredJobs = Math.random() > 0.6;

  let activeListings: JobListing[] = [];
  let expiredListings: JobListing[] = [];

  // Generate Active Listings (Recent: 0-30 days ago)
  if (hasActiveJobs) {
    const count = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < count; i++) {
      activeListings.push({
        id: `active-${i}`,
        type: JOB_TYPES[Math.floor(Math.random() * JOB_TYPES.length)],
        date: getDateDaysAgo(30),
      });
    }
  }

  // Generate Expired Listings (Old: 60-300 days ago)
  if (hasExpiredJobs) {
    const count = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < count; i++) {
      expiredListings.push({
        id: `expired-${i}`,
        type: JOB_TYPES[Math.floor(Math.random() * JOB_TYPES.length)],
        date: getDateDaysAgo(300 + 60), // Start from 60 days ago
      });
    }
  }

  return {
    eventCount: hasEvents ? Math.floor(Math.random() * 50) + 1 : 0,
    activeListings,
    expiredListings,
  };
};

// --- Main Component ---

const JobListingPage = () => {
  const { query, setQuery } = useQuery(companiesDefaultQuery);
  const [hideExpired, setHideExpired] = useState(false);

  const companySemesters = useAppSelector(selectAllCompanySemesters);
  const dispatch = useAppDispatch();

  // 1. Semester Resolution
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

  // 2. Data Fetching
  const backendQuery = useMemo(() => {
    const { studentContacts, ...restOfQuery } = query;
    return {
      ...restOfQuery,
      student_contacts: studentContacts,
      semester_id: String(currentCompanySemester?.id),
    };
  }, [query, currentCompanySemester?.id]);

  const { pagination } = useAppSelector(
    selectPaginationNext({
      endpoint: '/bdb/',
      entity: EntityType.Companies,
      query: backendQuery,
    }),
  );

  const companies = useAppSelector((state) =>
    selectTransformedAdminCompanies(state, { pagination }),
  );

  usePreparedEffect(
    'fetchBdb',
    () =>
      dispatch(fetchSemesters()).then((result) => {
        const companySemesters = Object.values(
          result.payload.entities.companySemesters,
        ).filter((companySemester) => companySemester !== undefined);

        const semester = resolveCurrentSemester(query.semester, companySemesters);
        return dispatch(
          fetchAllAdmin({ ...query, semester_id: semester!.id }, false),
        );
      }),
    [query.semester],
  );

  // 3. Enrich & Filter
  const filteredCompanies = useMemo(() => {
    return companies
      .map((company) => ({
        ...company,
        ...generateCompanyProfile(),
      }))
      .filter((company) => {
        if (company.eventCount > 0) return false;

        const hasActive = company.activeListings.length > 0;
        const hasExpired = company.expiredListings.length > 0;

        if (hideExpired) return hasActive;
        return hasActive || hasExpired;
      });
  }, [companies, hideExpired]);

  // 4. Columns Definition
  const columns: ColumnProps<(typeof filteredCompanies)[number]>[] = [
    {
      title: 'Bedrift',
      dataIndex: 'name',
      search: true,
      inlineFiltering: true,
      render: (_, company) => <a href={`/bdb/${company.id}`}>{company.name}</a>,
    },
    {
      title: 'Status',
      dataIndex: 'activeListings',
      centered: true,
      render: (activeListings: JobListing[]) => {
        const isActive = activeListings.length > 0;
        return (
          <Flex alignItems="center" justifyContent="center" gap="5px">
            {isActive ? (
              <>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#14532d' }} />
                <span style={{ color: '#14532d', fontWeight: 500 }}>Aktiv</span>
              </>
            ) : (
              <>
                <Icon iconNode={<Clock />} size={14} style={{ color: 'var(--text-gray)' }} />
                <span style={{ color: 'var(--text-gray)' }}>Utløpt</span>
              </>
            )}
          </Flex>
        );
      },
    },
    {
      title: 'Utlysninger',
      dataIndex: 'activeListings',
      render: (_, row) => (
        <Flex wrap gap="5px">
          {/* Active Listings */}
          {row.activeListings.map((job) => (
            <span
              key={job.id}
              className={cx(styles.tag, styles.level2)}
              // Native Tooltip: Shows date on hover
              title={`Publisert: ${job.date.toLocaleDateString()}`}
              style={{ cursor: 'help' }} // Visual clue that it's hoverable
            >
              {job.type}
            </span>
          ))}

          {/* Expired Listings */}
          {row.expiredListings.map((job) => (
            <span
              key={job.id}
              className={cx(styles.tag)}
              title={`Utløp: ${job.date.toLocaleDateString()}`}
              style={{
                backgroundColor: 'var(--additive-background)',
                color: 'var(--text-gray)',
                border: '1px solid var(--border-gray)',
                textDecoration: 'line-through',
                cursor: 'help'
              }}
            >
              {job.type}
            </span>
          ))}
        </Flex>
      ),
    },
  ];

  return (
    <ContentMain>
      <Card severity="info" style={{ marginBottom: 'var(--spacing-md)' }}>
        <Card.Header>Jobbannonser uten arrangement</Card.Header>
        Oversikt over bedrifter med jobbannonser som ikke har holdt arrangementer.
        Hold over utlysningene for å se dato.
      </Card>

      <Flex wrap justifyContent="space-between" alignItems="center">
        {/* Navigation */}
        <Flex>
          <Icon
            iconNode={<ChevronLeft />}
            onPress={() =>
              setQuery({
                ...query,
                semester: getSemesterSlugOffset(
                  currentCompanySemester!.id,
                  companySemesters,
                  'previous',
                ),
              })
            }
          />
          <SelectInput
            name="semester"
            options={companySemesters
              .sort((_, b) => (b.semester === 'autumn' ? 1 : -1))
              .sort((a, b) => b.year - a.year)
              .map((semester) => ({
                label: semesterToHumanReadable(semester.semester, semester.year),
                value: semester.id as number,
              }))}
            value={{
              label: currentCompanySemester
                ? semesterToHumanReadable(
                  currentCompanySemester.semester,
                  currentCompanySemester.year,
                )
                : 'Velg semester',
              value: currentCompanySemester?.id as number,
            }}
            onChange={(e) =>
              setQuery({
                ...query,
                semester: getSemesterSlugById(
                  (e as { label: string; value: number }).value,
                  companySemesters,
                ),
              })
            }
            className={styles.dropDown}
          />
          <Icon
            iconNode={<ChevronRight />}
            onPress={() =>
              setQuery({
                ...query,
                semester: getSemesterSlugOffset(
                  currentCompanySemester!.id,
                  companySemesters,
                  'next',
                ),
              })
            }
          />
        </Flex>

        {/* Filters */}
        <Flex alignItems="center" gap="10px">
          <label
            htmlFor="hideExpired"
            style={{ cursor: 'pointer', userSelect: 'none', fontWeight: 500 }}
          >
            Vis kun aktive
          </label>
          <CheckBox
            id="hideExpired"
            checked={hideExpired}
            onChange={() => setHideExpired(!hideExpired)}
          />
        </Flex>
      </Flex>

      <Table
        columns={columns}
        data={filteredCompanies}
        onChange={setQuery}
        loading={pagination.fetching}
        filters={query}
        onLoad={() => {
          currentCompanySemester?.id &&
          dispatch(fetchAllAdmin(backendQuery, true));
        }}
        hasMore={pagination.hasMore}
      />
    </ContentMain>
  );
};

export default guardLogin(JobListingPage);
