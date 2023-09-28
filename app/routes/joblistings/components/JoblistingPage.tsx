import { Flex, LoadingIndicator } from '@webkom/lego-bricks';
import moment from 'moment-timezone';
import qs from 'qs';
import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom-v5-compat';
import { fetchAll } from 'app/actions/JoblistingActions';
import { selectJoblistings } from 'app/reducers/joblistings';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import JoblistingsList from './JoblistingList';
import styles from './JoblistingPage.css';
import JoblistingsRightNav from './JoblistingRightNav';

const MAJOR_CITIES = ['Oslo', 'Trondheim', 'Bergen', 'Tromsø'];

function filterJoblistings(joblistings, grades, jobTypes, workplaces) {
  return joblistings.filter((joblisting) => {
    const gradeBoolean =
      !grades.length ||
      grades.some(
        (grade) =>
          joblisting.fromYear <= Number(grade) &&
          joblisting.toYear >= Number(grade)
      );
    const jobTypesBoolean =
      !jobTypes.length || jobTypes.includes(joblisting.jobType);
    const workplacesBoolean =
      !workplaces.length ||
      joblisting.workplaces.some(
        (workplace) =>
          workplaces.includes(workplace.town) ||
          (workplaces.includes('Annet') &&
            !MAJOR_CITIES.includes(workplace.town))
      );
    return gradeBoolean && jobTypesBoolean && workplacesBoolean;
  });
}

const dateSort =
  (field, reverse = false) =>
  (a, b) => {
    if (a[field] === b[field]) return (reverse ? -1 : 1) * (a.id - b.id);
    const date1 = moment(a[field]);
    const date2 = moment(b[field]);
    return (reverse ? -1 : 1) * (date1 - date2);
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
        return dateSort('createdAt', -1);

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
  const search = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

  const parsedQuery = useMemo(
    () => ({
      sortType: search.order,
      filterGrade: search.grades ? search.grades.split(',') : [],
      filterJobType: search.jobTypes ? search.jobTypes.split(',') : [],
      filterWorkplaces: search.workplaces ? search.workplaces.split(',') : [],
    }),
    [search]
  );

  const filteredJoblistings = useMemo(() => {
    return filterJoblistings(
      unsortedJoblistings,
      parsedQuery.filterGrade,
      parsedQuery.filterJobType,
      parsedQuery.filterWorkplaces
    );
  }, [unsortedJoblistings, parsedQuery]);

  const joblistings = useMemo(() => {
    return sortJoblistings(filteredJoblistings, parsedQuery.sortType);
  }, [filteredJoblistings, parsedQuery.sortType]);

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
        <JoblistingsRightNav query={search} />
      </Flex>
    </div>
  );
};

export default JoblistingsPage;
