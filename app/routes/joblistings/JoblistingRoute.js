import { connect } from 'react-redux';
import moment from 'moment-timezone';
import qs from 'qs';
import { compose } from 'redux';

import { fetchAll } from 'app/actions/JoblistingActions';
import prepare from 'app/utils/prepare';
import JoblistingPage from './components/JoblistingPage';

function filterJoblistings(joblistings, grades, jobTypes, workplaces) {
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

const mapStateToProps = (state, props) => {
  let { search } = props.location;
  search = qs.parse(search, { ignoreQueryPrefix: true });
  const { history } = props;
  const joblistings = state.joblistings.items.map(
    (id) => state.joblistings.byId[id]
  );
  const sortType = search.order;
  const filterGrade = search.grades ? search.grades.split(',') : [];
  const filterJobType = search.jobTypes ? search.jobTypes.split(',') : [];
  const filterWorkplaces = search.workplaces
    ? search.workplaces.split(',')
    : [];
  const filteredJoblistings = filterJoblistings(
    joblistings,
    filterGrade,
    filterJobType,
    filterWorkplaces
  );
  const sortedJoblistings = sortJoblistings(filteredJoblistings, sortType);
  const actionGrant = state.joblistings.actionGrant || [];

  return {
    joblistings: sortedJoblistings,
    search,
    actionGrant,
    history,
  };
};

const mapDispatchToProps = { fetchAll };

export default compose(
  prepare((props, dispatch) => dispatch(fetchAll())),
  connect(mapStateToProps, mapDispatchToProps)
)(JoblistingPage);
