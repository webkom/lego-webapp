import { connect } from 'react-redux';
import { fetchAll } from 'app/actions/JoblistingActions';
import JoblistingsPage from './components/JoblistingsPage';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import { compose } from 'redux';

function loadData([], props) {
  props.fetchAll();
}

function filterJoblistings(joblistings, classes, jobtypes, workplaces) {
  console.log('heisann', jobtypes);
  console.log(classes);
  return joblistings.filter((joblisting) => {
    if (classes.length === 0) {
      return true;
    }
    for (const filterClass of classes) {
      if (joblisting.fromYear <= Number(filterClass) && joblisting.toYear >= Number(filterClass)) {
        return true;
      }
    }
    return false;
  }).filter((joblisting) => {
    if (jobtypes.length === 0) {
      return true;
    }
    for (const jobtype of jobtypes) {
      if (jobtype === joblisting.jobType) {
        return true;
      }
    }
    return false;
  }).filter((joblisting) => {
    if (workplaces.length === 0) {
      return true;
    }
    for (const workplace of workplaces) {
      if (workplace === joblisting.workplaces) {
        return true;
      }
    }
    return false;
  });
}

const dateSort = (a, b) => {
  const date1 = new Date(a.deadline);
  const date2 = new Date(b.deadline);
  return date1.getTime() - date2.getTime();
};

const companySort = (a, b) => a.company.localeCompare(b.company);

function sortJoblistings(joblistings, sortType) {
  return joblistings.sort(sortType === 'company' ? companySort : dateSort);
}

function mapStateToProps(state, props) {
  const { query } = props.location;
  const joblistings = state.joblistings.items
    .map((id) => state.joblistings.byId[id]);
  console.log('asd2', query);
  const sortType = query.sort === 'company' ? 'company' : 'deadline';
  const filterClass = query.class ? query.class.split(',') : [];
  const filterJobType = query.jobtypes ? query.jobtypes.split(',') : [];
  const filterWorkplaces = query.workplaces ? query.workplaces.split(',') : [];

  const filteredJoblistings = filterJoblistings(joblistings, filterClass,
    filterJobType, filterWorkplaces);
    console.log(filteredJoblistings);
  const sortedJoblistings = sortJoblistings(filteredJoblistings, sortType);

  return {
    joblistings: sortedJoblistings,
    query
  };
}

const mapDispatchToProps = { fetchAll };

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  fetchOnUpdate([], loadData)
)(JoblistingsPage);
