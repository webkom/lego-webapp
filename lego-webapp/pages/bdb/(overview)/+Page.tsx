import { Card, Flex, Icon } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';
import { ContentMain } from '~/components/Content';
import { SelectInput } from '~/components/Form';
import Table from '~/components/Table';
import UserLink from '~/components/UserLink';
import { fetchAllAdmin, fetchSemesters } from '~/redux/actions/CompanyActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { EntityType } from '~/redux/models/entities';
import { selectTransformedAdminCompanies } from '~/redux/slices/companies';
import { selectAllCompanySemesters } from '~/redux/slices/companySemesters';
import { selectPaginationNext } from '~/redux/slices/selectors';
import { guardLogin } from '~/utils/replaceUnlessLoggedIn';
import useQuery from '~/utils/useQuery';
import SemesterStatus from '../SemesterStatus';
import {
  contactStatuses,
  getClosestCompanySemester,
  getCompanySemesterBySlug,
  getSemesterSlugById,
  getSemesterSlugOffset,
  getSemesterStatus,
  getStatusDisplayName,
  semesterToHumanReadable,
} from '../utils';
import type { ColumnProps } from '~/components/Table';
import type CompanySemester from '~/redux/models/CompanySemester';
import type { TransformedStudentCompanyContact } from '~/redux/slices/companies';

const companiesDefaultQuery = {
  active: '' as '' | 'true' | 'false',
  name: '',
  studentContact: '',
  semester: '',
  search: '',
  status: '',
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
    () =>
      dispatch(fetchSemesters()).then((result) => {
        const companySemesters = Object.values(
          result.payload.entities.companySemesters,
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
      }),
    [query.semester],
  );

  const columns: ColumnProps<(typeof companies)[number]>[] = [
    {
      title: 'Bedrift',
      dataIndex: 'name',
      search: true,
      inlineFiltering: true,
      centered: false,
      render: (_, company) => <a href={`/bdb/${company.id}`}>{company.name}</a>,
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
      filter: contactStatuses.map((status) => ({
        value: status,
        label: getStatusDisplayName(status),
      })),
      inlineFiltering: false,
      filterOptions: {
        multiSelect: true,
      },
    },
    {
      title: 'Studentkontakter',
      dataIndex: 'student_contacts',
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
              <UserLink
                key={studentContact.user.id}
                user={studentContact.user}
              />
            ))}
          </Flex>
        ),
    },
    {
      // Using an empty column for filtering
      title: '',
      dataIndex: 'active',
      maxWidth: 50,
      render: () => '',
      filterIndex: 'active',
      filter: [
        { value: 'true', label: 'Aktiv' },
        { value: 'false', label: 'Inaktiv' },
      ],
    },
  ];

  return (
    <ContentMain>
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
        columns={columns}
        data={companies}
        onChange={setQuery}
        loading={pagination.fetching}
        filters={query}
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
    </ContentMain>
  );
};

export default guardLogin(BdbPage);
