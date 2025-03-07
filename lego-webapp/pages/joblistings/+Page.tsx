import { filterSidebar, LinkButton, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import moment from 'moment-timezone';
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { usePageContext } from 'vike-react/usePageContext';
import JoblistingsList from '~/pages/joblistings/_components/JoblistingList';
import JoblistingFilters from '~/pages/joblistings/_components/JoblistingRightNav';
import { fetchAll } from '~/redux/actions/JoblistingActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectAllJoblistings } from '~/redux/slices/joblistings';
import { parseQueryString } from '~/utils/useQuery';
import type { ListJoblisting } from '~/redux/models/Joblisting';

export const defaultJoblistingsQuery = {
  order: 'deadline',
  grades: [] as string[],
  jobTypes: [] as string[],
  workplaces: [] as string[],
};

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

  return joblistings.sort(sorter);
};

const JoblistingsPage = () => {
  const unsortedJoblistings = useAppSelector(selectAllJoblistings);
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
    () => dispatch(fetchAll({ timeFilter: true })),
    [],
  );

  return (
    <Page
      title="Jobbannonser"
      sidebar={filterSidebar({
        children: <JoblistingFilters />,
      })}
      actionButtons={
        actionGrant.includes('create') && (
          <LinkButton href="/joblistings/create">Ny jobbannonse</LinkButton>
        )
      }
    >
      <Helmet title="Karriere" />
      <JoblistingsList
        joblistings={joblistings}
        totalCount={unsortedJoblistings.length}
      />
    </Page>
  );
};

export default JoblistingsPage;
