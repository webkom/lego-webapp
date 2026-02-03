import { Card, Flex, Icon } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import cx from 'classnames';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ContentMain } from '~/components/Content';
import { SelectInput } from '~/components/Form';
import type { ColumnProps } from '~/components/Table';
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
import styles from '../CompanyColors.module.css';
import type CompanySemester from '~/redux/models/CompanySemester';

const companiesDefaultQuery = {
  active: '' as '' | 'true' | 'false',
  name: '',
  studentContacts: '',
  semester: '',
  search: '',
  status: '',
  activeYears: '',
};

const randomSubarray = (array: number[]) => {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const withEventType = shuffled.map((year) => {
    const semester = Math.random() > 0.5 ? 'V' : 'H';
    return [`${year}${semester}`, Math.floor(Math.random() * 5) + 1] as [
      string,
      number,
    ];
  });

  return withEventType.slice(0, Math.floor(Math.random() * shuffled.length));
};

const BdbPage = () => {
  const { query, setQuery } = useQuery(companiesDefaultQuery);

  const [sortMode, setSortMode] = useState<
    'default' | 'most_active' | 'least_active'
  >('default');
  const [showOnlyRecent, setShowOnlyRecent] = useState(false);

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

  const companiesWithYears = useMemo(() => {
    return companies.map((company) => ({
      ...company,
      activeYears: randomSubarray(Array.from({ length: 10 }, (_, i) => i + 15)),
    }));
  }, [companies]);

  const processedCompanies = useMemo(() => {
    let result = [...companiesWithYears];

    if (showOnlyRecent) {
      result = result.filter((company) =>
        company.activeYears.some(([yearStr]) => parseInt(yearStr, 10) >= 22),
      );
    }

    if (sortMode === 'most_active') {
      result.sort((a, b) => b.activeYears.length - a.activeYears.length);
    } else if (sortMode === 'least_active') {
      result.sort((a, b) => a.activeYears.length - b.activeYears.length);
    }

    return result;
  }, [companiesWithYears, sortMode, showOnlyRecent]);

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

  const columns: ColumnProps<(typeof companiesWithYears)[number]>[] = [
    {
      title: 'Bedrift',
      dataIndex: 'name',
      search: true,
      inlineFiltering: true,
      centered: true,
      render: (_, company) => <a href={`/bdb/${company.id}`}>{company.name}</a>,
    },
    {
      title: 'År med arrangement',
      dataIndex: 'activeYears',
      sorter: (a, b) => {
        const getMaxYear = (years: [string, number][]) => {
          if (years.length === 0) return 0;
          return Math.max(...years.map((y) => parseInt(y[0], 10)));
        };
        return getMaxYear(a.activeYears) - getMaxYear(b.activeYears);
      },
      filters: [
        { text: 'Vår (V)', value: 'V' },
        { text: 'Høst (H)', value: 'H' },
        ...Array.from({ length: 11 }, (_, i) => {
          const year = 25 - i;
          return { text: `20${year}`, value: String(year) };
        }),
      ],
      onFilter: (value, record) => {
        const filterVal = value as string;
        if (filterVal === 'V' || filterVal === 'H') {
          return record.activeYears.some((y) => y[0].endsWith(filterVal));
        }
        return record.activeYears.some((y) => {
          const yearNumber = parseInt(y[0], 10);
          return String(yearNumber) === filterVal;
        });
      },
      inlineFiltering: false,
      filterOptions: {
        multiSelect: true,
      },
      render: (activeYears: [string, number][]) => {
        const sortedYears = [...activeYears].sort((a, b) => {
          const yearA = parseInt(a[0], 10);
          const yearB = parseInt(b[0], 10);
          if (yearA !== yearB) return yearA - yearB;
          return a[0].endsWith('V') ? -1 : 1;
        });

        if (sortedYears.length === 0) return <span>-</span>;

        const firstYear = sortedYears[0];
        const lastYear = sortedYears[sortedYears.length - 1];
        const isRange = sortedYears.length > 1;

        const allYearsString = sortedYears.map((y) => y[0]).join(', ');

        return (
          <Flex
            justifyContent="center"
            gap="8px"
            title={`Aktive semestre: ${allYearsString}`}
            style={{ cursor: 'help' }}
          >
            <span className={cx(styles.tag, styles[`level${firstYear[1]}`])}>
              {firstYear[0]}
            </span>

            {isRange && (
              <div>
                <ArrowRight size={16} />

                <span className={cx(styles.tag, styles[`level${lastYear[1]}`])}>
                  {lastYear[0]}
                </span>
              </div>
            )}
          </Flex>
        );
      },
    },
    {
      title: 'År med jobbannonser',
      dataIndex: 'activeYears',
      sorter: (a, b) => {
        const getMaxYear = (years: [string, number][]) => {
          if (years.length === 0) return 0;
          return Math.max(...years.map((y) => parseInt(y[0], 10)));
        };
        return getMaxYear(a.activeYears) - getMaxYear(b.activeYears);
      },
      filters: [
        { text: 'Vår (V)', value: 'V' },
        { text: 'Høst (H)', value: 'H' },
        ...Array.from({ length: 11 }, (_, i) => {
          const year = 25 - i;
          return { text: `20${year}`, value: String(year) };
        }),
      ],
      onFilter: (value, record) => {
        const filterVal = value as string;
        if (filterVal === 'V' || filterVal === 'H') {
          return record.activeYears.some((y) => y[0].endsWith(filterVal));
        }
        return record.activeYears.some((y) => {
          const yearNumber = parseInt(y[0], 10);
          return String(yearNumber) === filterVal;
        });
      },
      inlineFiltering: false,
      filterOptions: {
        multiSelect: true,
      },
      render: (activeYears: [string, number][]) => {
        const sortedYears = [...activeYears].sort((a, b) => {
          const yearA = parseInt(a[0], 10);
          const yearB = parseInt(b[0], 10);
          if (yearA !== yearB) return yearA - yearB;
          return a[0].endsWith('V') ? -1 : 1;
        });

        if (sortedYears.length === 0) return <span>-</span>;

        const firstYear = sortedYears[0];
        const lastYear = sortedYears[sortedYears.length - 1];
        const isRange = sortedYears.length > 1;

        const allYearsString = sortedYears.map((y) => y[0]).join(', ');

        return (
          <Flex
            alignItems="center"
            justifyContent="center"
            gap="8px"
            title={`Aktive semestre: ${allYearsString}`}
            style={{ cursor: 'help' }}
          >
            <span className={cx(styles.tag, styles[`level${firstYear[1]}`])}>
              {firstYear[0]}
            </span>

            {isRange && (
              <div>
                <span style={{ color: '#888', fontSize: '1.2em' }}>→</span>

                <span className={cx(styles.tag, styles[`level${lastYear[1]}`])}>
                  {lastYear[0]}
                </span>
              </div>
            )}
          </Flex>
        );
      },
    },
  ];

  return (
    <ContentMain>
      <Card severity="info">
        <Card.Header>Tips</Card.Header>
        Du kan endre semesterstatuser ved å trykke på dem i listen!
      </Card>

      <Flex
        justifyContent="space-between"
        alignItems="center"
        style={{ marginBottom: '15px' }}
      >
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
                  semester.semester,
                  semester.year,
                ),
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

        <Flex gap="1rem" alignItems="center">
          <div>
            <SelectInput
              name="sortMode"
              isClearable={false}
              value={{
                label:
                  sortMode === 'default'
                    ? 'Sortering: Standard'
                    : sortMode === 'most_active'
                      ? 'Mest aktive'
                      : 'Minst aktive',
                value: sortMode,
              }}
              options={[
                { label: 'Standard (Alfabetisk)', value: 'default' },
                { label: 'Mest aktive', value: 'most_active' },
                { label: 'Minst aktive', value: 'least_active' },
              ]}
              onChange={(option) => setSortMode((option as any).value)}
            />
          </div>
        </Flex>
      </Flex>

      <Table
        columns={columns}
        data={processedCompanies}
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
