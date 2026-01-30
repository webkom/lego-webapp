import { Card, Flex, Icon } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';
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
  getClosestCompanySemester,
  getCompanySemesterBySlug,
  getSemesterSlugById,
  getSemesterSlugOffset,
  semesterToHumanReadable,
} from '../../utils';
import type { ColumnProps } from '~/components/Table';
import type CompanySemester from '~/redux/models/CompanySemester';


const companiesDefaultQuery = {
  active: '' as '' | 'true' | 'false',
  name: '',
  studentContacts: '',
  semester: '',
  search: '',
  status: '',
};

type CompanyWithStats = ReturnType<typeof selectTransformedAdminCompanies>[number] & {
  eventCount: number;
  attendeeCount: number;
  maxCapacity: number;
  waitlistCount: number;
  averageRating: string;
  lastPresentationDate: Date;
  noShow: number;
};

const generateRandomStats = () => {
  const maxCapacity = [20, 40, 60, 100][Math.floor(Math.random() * 4)];
  const registrationCount =  Math.floor(Math.random() * (maxCapacity + 20));
  const attendeeCount = registrationCount > maxCapacity ? maxCapacity : registrationCount;
  const waitingList = registrationCount > maxCapacity ? registrationCount - maxCapacity : 0;
  const noShow = Math.floor(Math.random()*5);
  const eventType = ["Bedpress", "Kurs", "FrokostForedrag", "Lunsjpresentasjon", "Nexus"][Math.floor(Math.random()*5)];

  const today = new Date();
  const pastDate = new Date(
    today.getFullYear() - Math.floor(Math.random() * 5 +1 ),
    Math.floor(Math.random() * 12),
    Math.floor(Math.random() * 28)
  );

  return {
    eventType,
    attendeeCount,
    maxCapacity,
    waitlistCount: waitingList,
    dropOffCount: Math.floor(Math.random() * 5),
    averageRating: (Math.random() * 2 + 3).toFixed(1),
    lastPresentationDate: pastDate,
    noShow
  };
};

const BdbPage = () => {
  const { query, setQuery } = useQuery(companiesDefaultQuery);
  const companySemesters = useAppSelector(selectAllCompanySemesters);
  const dispatch = useAppDispatch();


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

        const semester = resolveCurrentSemester(
          query.semester,
          companySemesters,
        );
        return dispatch(
          fetchAllAdmin({ ...query, semester_id: semester!.id }, false),
        );
      }),
    [query.semester],
  );


  const companiesWithStats: CompanyWithStats[] = useMemo(() => {
    return companies.map((company) => ({
      ...company,
      ...generateRandomStats(),
    }));
  }, [companies]);

  const recentCompanies = useMemo(() => {
    const threeYearsAgo = new Date();
    threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);

    return companiesWithStats.filter((company) => {
      return company.lastPresentationDate > threeYearsAgo;
    });
  }, [companiesWithStats]);

  const semesterStats = useMemo(() => {
    if (recentCompanies.length === 0) return null;

    const totalEvents = Math.floor(Math.random() * 5) + recentCompanies.length
    const totalAttendees = recentCompanies.reduce((acc, curr) => acc + curr.attendeeCount, 0);

    const totalRating = recentCompanies.reduce((acc, curr) => acc + parseFloat(curr.averageRating), 0);
    const avgRating = (totalRating / recentCompanies.length).toFixed(1);

    return {
      companyCount: recentCompanies.length,
      totalEvents,
      totalAttendees,
      avgRating,
    };
  }, [recentCompanies]);


  const columns: ColumnProps<CompanyWithStats>[] = [
    {
      title: 'Bedrift',
      dataIndex: 'name',
      search: true,
      inlineFiltering: true,
      render: (_, company) => <a href={`/bdb/${company.id}`}>{company.name}</a>,
    },
    {
      title: 'Arrangement',
      dataIndex: 'eventType',
      centered: true,
    },
    {
      title: 'Påmeldte (Venteliste)',
      dataIndex: 'attendeeCount',
      centered: true,
      render: (_, stat) => `${stat.attendeeCount}/${stat.maxCapacity} (${stat.waitlistCount}) `,
    },
    {
      title: 'Rating',
      dataIndex: 'averageRating',
      centered: true,
    },
    {
      title: 'Frafall',
      dataIndex: 'noShow',
      centered: true,
    },
  ];


  return (
    <ContentMain>
      {semesterStats && (
        <Card style={{ marginBottom: 'var(--spacing-md)' }}>
          <Flex wrap justifyContent="space-around" gap="var(--spacing-md)">
            <Flex column alignItems="center">
              <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {semesterStats.companyCount}
              </span>
              <span style={{ color: 'var(--text-gray)' }}>Aktive bedrifter</span>
            </Flex>
            <Flex column alignItems="center">
              <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {semesterStats.totalEvents}
              </span>
              <span style={{ color: 'var(--text-gray)' }}>Totalt arrangementer</span>
            </Flex>
            <Flex column alignItems="center">
              <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {semesterStats.totalAttendees}
              </span>
              <span style={{ color: 'var(--text-gray)' }}>Totalt påmeldte</span>
            </Flex>
            <Flex column alignItems="center">
              <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {semesterStats.avgRating}
              </span>
              <span>Snitt rating</span>
            </Flex>
          </Flex>
        </Card>
      )}

      <Flex width="fit-content" style={{ marginBottom: 'var(--spacing-sm)' }}>
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
        data={recentCompanies}
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

export default guardLogin(BdbPage);
