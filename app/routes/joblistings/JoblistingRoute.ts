import moment from 'moment-timezone';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { fetchAll } from 'app/actions/JoblistingActions';
import { parseQueryString } from 'app/utils/useQuery';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import JoblistingPage from './components/JoblistingPage';
import type { ListJoblisting } from 'app/store/models/Joblisting';

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
  workplaces: string[],
) {
  return joblistings.filter((joblisting) => {
    const gradeBoolean =
      grades.length === 0 ||
      grades.find(
        (grade) =>
          joblisting.fromYear <= Number(grade) &&
          joblisting.toYear >= Number(grade),
      );
    const jobTypesBoolean =
      jobTypes.length === 0 ||
      jobTypes.find((jobType) => jobType === joblisting.jobType);
    const workplacesBoolean =
      workplaces.length === 0 ||
      joblisting.workplaces.some((workplace) =>
        workplaces.includes(workplace.town),
      ) ||
      (workplaces.includes('Annet') &&
        joblisting.workplaces.some(
          (workplace) =>
            !['Oslo', 'Trondheim', 'Bergen', 'Tromsø'].includes(workplace.town),
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

const mapStateToProps = (state, props) => {
  const { order, grades, jobTypes, workplaces } = parseQueryString(
    props.location.search,
    defaultJoblistingsQuery,
  );
  const joblistings = state.joblistings.items.map(
    (id) => state.joblistings.byId[id],
  );
  const filteredJoblistings = filterJoblistings(
    joblistings,
    grades,
    jobTypes,
    workplaces,
  );
  const sortedJoblistings = sortJoblistings(filteredJoblistings, order);
  const actionGrant = state.joblistings.actionGrant || [];
  return {
    joblistings: sortedJoblistings,
    actionGrant,
  };
};

const mapDispatchToProps = {
  fetchAll,
};
export default compose(
  withPreparedDispatch('fetchJoblisting', (props, dispatch) =>
    dispatch(fetchAll()),
  ),
  connect(mapStateToProps, mapDispatchToProps),
)(JoblistingPage);
