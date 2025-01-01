import { Card, Flex, Icon } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllAdmin, fetchSemesters } from 'app/actions/CompanyActions';
import { SelectInput } from 'app/components/Form';
import Table from 'app/components/Table';
import { selectTransformedAdminCompanies } from 'app/reducers/companies';
import { selectAllCompanySemesters } from 'app/reducers/companySemesters';
import { selectPaginationNext } from 'app/reducers/selectors';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { EntityType } from 'app/store/models/entities';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import useQuery from 'app/utils/useQuery';
import {
  getClosestCompanySemester,
  getCompanySemesterBySlug,
  getSemesterSlugById,
  getSemesterSlugOffset,
  getSemesterStatus,
  semesterToHumanReadable,
} from '../utils';
import SemesterStatus from './SemesterStatus';
import styles from './bdb.module.css';
import type { ColumnProps } from 'app/components/Table';
import type { TransformedSemesterStatus } from 'app/reducers/companies';
import type CompanySemester from 'app/store/models/CompanySemester';
import type { UnknownUser } from 'app/store/models/User';

const companiesDefaultQuery = {
  active: '' as '' | 'true' | 'false',
  name: '',
  studentContact: '',
  semester: '',
};

const BdbPage = () => {
  const { query, setQuery } = useQuery(companiesDefaultQuery);

  const companySemesters = useAppSelector(selectAllCompanySemesters);

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

  const { pagination } = useAppSelector(
    selectPaginationNext({
      endpoint: '/bdb/',
      entity: EntityType.Companies,
      query: {
        ...query,
        semester_id: String(currentCompanySemester?.id),
      },
    }),
  );

  const companies = useAppSelector((state) =>
    selectTransformedAdminCompanies(state, { pagination }),
  );

  const dispatch = useAppDispatch();
  usePreparedEffect(
    'fetchBdb',
    async () => {
      if (!companySemesters.length) {
        const action = await dispatch(fetchSemesters());
        const companySemesters = Object.values(
          action.payload.entities.companySemesters,
        ).filter((companySemester) => companySemester !== undefined);
        const semester = resolveCurrentSemester(
          query.semester,
          companySemesters,
        );
        return dispatch(
          fetchAllAdmin(
            {
              ...query,
              semester_id: semester!.id,
            },
            false,
          ),
        );
      }
      return dispatch(
        fetchAllAdmin(
          {
            ...query,
            semester_id: currentCompanySemester!.id,
          },
          false,
        ),
      );
    },
    [query.semester, currentCompanySemester, companySemesters],
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

  return (
    <>
      <Card severity="info">
        <Card.Header>Tips</Card.Header>
        Du kan endre semesterstatuser ved å trykke på dem i listen!
      </Card>

      <Flex width="fit-content">
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
              label: semesterToHumanReadable(
                semester as TransformedSemesterStatus,
              ),
              value: semester.id as number,
            }))}
          value={{
            label: currentCompanySemester
              ? semesterToHumanReadable(
                  currentCompanySemester as TransformedSemesterStatus,
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

      <Table
        className={styles.bdbTable}
        columns={columns}
        data={companies}
        filters={query}
        onChange={setQuery}
        loading={pagination.fetching}
        onLoad={() => {
          currentCompanySemester?.id &&
            dispatch(
              fetchAllAdmin(
                {
                  ...query,
                  semester_id: currentCompanySemester.id,
                },
                true,
              ),
            );
        }}
        hasMore={pagination.hasMore}
      />
    </>
  );
};

export default guardLogin(BdbPage);
