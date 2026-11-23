import { filterSidebar, HeroPage, Icon, LinkButton } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Plus } from 'lucide-react';
import moment from 'moment-timezone';
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { usePageContext } from 'vike-react/usePageContext';
import JoblistingsList from '~/pages/joblistings/_components/JoblistingList';
import JoblistingFilters from '~/pages/joblistings/_components/JoblistingRightNav';
import { fetchAll } from '~/redux/actions/JoblistingActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { EntityType } from '~/redux/models/entities';
import { selectAllJoblistings } from '~/redux/slices/joblistings';
import { selectPaginationNext } from '~/redux/slices/selectors';
import { parseQueryString } from '~/utils/useQuery';
import type { ListJoblisting } from '~/redux/models/Joblisting';

export const defaultJoblistingsQuery = {
  order: 'deadline',
  grades: [] as string[],
  jobTypes: [] as string[],
  workplaces: [] as string[],
};

const joblistingsFetchQuery = { timeFilter: true };

const MAJOR_CITIES = ['Oslo', 'Trondheim', 'Bergen', 'Tromsø'];

function filterJoblistings(
  joblistings: ListJoblisting[],
  grades: string[],
  jobTypes: string[],
  workplaces: string[],
) {
  return joblistings.filter((joblisting) => {
    const gradeBoolean =
      !grades.length ||
      grades.some(
        (grade) =>
          joblisting.fromYear <= Number(grade) &&
          joblisting.toYear >= Number(grade),
      );
    const jobTypesBoolean =
      !jobTypes.length || jobTypes.includes(joblisting.jobType);
    const workplacesBoolean =
      !workplaces.length ||
      joblisting.workplaces.some(
        (workplace) =>
          workplaces.includes(workplace.town) ||
          (workplaces.includes('Annet') &&
            !MAJOR_CITIES.includes(workplace.town)),
      );
    return gradeBoolean && jobTypesBoolean && workplacesBoolean;
  });
}

const dateSort =
  (field: keyof ListJoblisting, reverse = false) =>
  (a: ListJoblisting, b: ListJoblisting) => {
    if (a[field] === b[field])
      return (reverse ? -1 : 1) * (Number(a.id) - Number(b.id));
    const date1 = moment(a[field] as string);
    const date2 = moment(b[field] as string);
    return (reverse ? -1 : 1) * (date1.unix() - date2.unix());
  };

const companySort = (a: ListJoblisting, b: ListJoblisting) => {
  if (a.company.name === b.company.name) return Number(a.id) - Number(b.id);
  return a.company.name.localeCompare(b.company.name);
};

const sortJoblistings = (joblistings: ListJoblisting[], sortType: string) => {
  const sorter = (() => {
    switch (sortType) {
      case 'company':
        return companySort;

      case 'createdAt':
        return dateSort('createdAt', true);

      case 'deadline':
      default:
        return dateSort('deadline');
    }
  })();

  return joblistings
    .slice()
    .sort((a, b) => Number(b.isPinned) - Number(a.isPinned) || sorter(a, b));
};

const JoblistingsPage = () => {
  const { pagination } = useAppSelector(
    selectPaginationNext({
      endpoint: '/joblistings/',
      query: joblistingsFetchQuery,
      entity: EntityType.Joblistings,
    }),
  );
  const unsortedJoblistings = useAppSelector((state) =>
    selectAllJoblistings(state, { pagination }),
  );
  const pageContext = usePageContext();

  const { order, grades, jobTypes, workplaces } = parseQueryString(
    pageContext.urlParsed.searchOriginal ?? '',
    defaultJoblistingsQuery,
  );

  const filteredJoblistings = filterJoblistings(
    unsortedJoblistings,
    grades,
    jobTypes,
    workplaces,
  );
  const joblistings = useMemo(() => {
    return sortJoblistings(filteredJoblistings, order);
  }, [filteredJoblistings, order]);

  const dispatch = useAppDispatch();
  const actionGrant = useAppSelector((state) => state.joblistings.actionGrant);

  usePreparedEffect(
    'fetchJoblistingPage',
    () => dispatch(fetchAll(joblistingsFetchQuery)),
    [],
  );

  return (
    <HeroPage
      title="Jobbannonser"
      actions={
        actionGrant.includes('create') && (
          <LinkButton dark href="/joblistings/new">
            <Icon iconNode={<Plus />} size={20} />
            Ny jobbannonse
          </LinkButton>
        )
      }
    >
      <Helmet title="Karriere" />
      <HeroPage.Section
        sidebar={filterSidebar({
          children: <JoblistingFilters />,
        })}
      >
        <JoblistingsList
          joblistings={joblistings}
          totalCount={unsortedJoblistings.length}
        />
      </HeroPage.Section>
    </HeroPage>
  );
};

export default JoblistingsPage;
