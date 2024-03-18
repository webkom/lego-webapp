import { Flex } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import moment from 'moment-timezone';
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { fetchAll } from 'app/actions/JoblistingActions';
import { selectJoblistings } from 'app/reducers/joblistings';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { parseQueryString } from 'app/utils/useQuery';
import JoblistingsList from './JoblistingList';
import styles from './JoblistingPage.css';
import JoblistingsRightNav from './JoblistingRightNav';
import type { ListJoblisting } from 'app/store/models/Joblisting';

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
  (field: string, reverse = false) =>
  (a, b) => {
    if (a[field] === b[field]) return (reverse ? -1 : 1) * (a.id - b.id);
    const date1 = moment(a[field]);
    const date2 = moment(b[field]);
    return (reverse ? -1 : 1) * (date1.unix() - date2.unix());
  };

const companySort = (a, b) => {
  if (a.company.name === b.company.name) return a.id - b.id;
  return a.company.name.localeCompare(b.company.name);
};

const sortJoblistings = (joblistings, sortType) => {
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
  const unsortedJoblistings = useAppSelector((state) =>
    selectJoblistings(state),
  );

  const location = useLocation();
  const { order, grades, jobTypes, workplaces } = parseQueryString(
    location.search,
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

  usePreparedEffect(
    'fetchJoblistingPage',
    () => dispatch(fetchAll({ timeFilter: true })),
    [],
  );

  return (
    <div className={styles.root}>
      <Helmet title="Karriere" />
      <Flex className={styles.page}>
        <JoblistingsList joblistings={joblistings} />
        <JoblistingsRightNav />
      </Flex>
    </div>
  );
};

export default JoblistingsPage;
