import { Flex, LoadingIndicator } from '@webkom/lego-bricks';
import moment from 'moment-timezone';
import qs from 'qs';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom-v5-compat';
import { fetchAll } from 'app/actions/JoblistingActions';
import { selectJoblistings } from 'app/reducers/joblistings';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import JoblistingsList from './JoblistingList';
import styles from './JoblistingPage.css';
import JoblistingsRightNav from './JoblistingRightNav';
import type { ListJoblisting } from 'app/store/models/Joblisting';
import { parseQueryString } from 'app/utils/useQuery';

export const defaultJoblistingsQuery = {
  order: 'deadline',
  grades: [] as string[],
  jobTypes: [] as string[],
  workplaces: [] as string[],
};

function filterJoblistings(
  joblistings: ListJoblisting[],
  grades: string[],
  jobTypes: string[],
  workplaces: string[]
) {
  return joblistings.filter((joblisting) => {
    const gradeBoolean =
      grades.length === 0 ||
      grades.find(
        (grade) =>
          joblisting.fromYear <= Number(grade) &&
          joblisting.toYear >= Number(grade)
      );
    const jobTypesBoolean =
      jobTypes.length === 0 ||
      jobTypes.find((jobType) => jobType === joblisting.jobType);
    const workplacesBoolean =
      workplaces.length === 0 ||
      joblisting.workplaces.some((workplace) =>
        workplaces.includes(workplace.town)
      ) ||
      (workplaces.includes('Annet') &&
        joblisting.workplaces.some(
          (workplace) =>
            !['Oslo', 'Trondheim', 'Bergen', 'Tromsø'].includes(workplace.town)
        )) ||
      (workplaces.includes('Annet') && joblisting.workplaces.length === 0);
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
    selectJoblistings(state)
  );

  const location = useLocation();
  const { order, grades, jobTypes, workplaces } = parseQueryString(
    location.search,
    defaultJoblistingsQuery
  );

  const filteredJoblistings = filterJoblistings(
    unsortedJoblistings,
    grades,
    jobTypes,
    workplaces
  );
  const joblistings = sortJoblistings(filteredJoblistings, order);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAll());
  }, [dispatch]);

  if (!joblistings) {
    return <LoadingIndicator loading />;
  }

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
