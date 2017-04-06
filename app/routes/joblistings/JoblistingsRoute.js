import { connect } from 'react-redux';
import { fetchAll } from 'app/actions/JoblistingActions';
import JoblistingsPage from './components/JoblistingsPage';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import { compose } from 'redux';
import moment from 'moment';

function loadData(params, props) {
  props.fetchAll();
}

function filterJoblistings(joblistings, classes, jobtypes, workplaces) {
  return joblistings.filter(joblisting => {
    let classBoolean = false;
    let jobtypesBoolean = false;
    let workplacesBoolean = false;
    if (classes.length === 0) {
      classBoolean = true;
    } else {
      classBoolean = classes.find(
        c => joblisting.fromYear <= Number(c) && joblisting.toYear >= Number(c)
      );
    }
    if (jobtypes.length === 0) {
      jobtypesBoolean = true;
    } else {
      jobtypesBoolean = jobtypes.find(j => j === joblisting.jobType);
    }
    if (workplaces.length === 0) {
      workplacesBoolean = true;
    } else {
      workplacesBoolean = joblisting.workplaces.some(w =>
        workplaces.includes(w.town)) ||
        (workplaces.includes('Annet') &&
          joblisting.workplaces.some(
            w => !['Oslo', 'Trondheim', 'Bergen', 'Tromsø'].includes(w.town)
          ));
    }
    return classBoolean && jobtypesBoolean && workplacesBoolean;
  });
}

const dateSort = (a, b) => {
  const date1 = moment(a.deadline);
  const date2 = moment(b.deadline);
  return date1.isAfter(date2);
};

const companySort = (a, b) => a.company.name.localeCompare(b.company.name);

function sortJoblistings(joblistings, sortType) {
  return joblistings.sort(sortType === 'company' ? companySort : dateSort);
}

function mapStateToProps(state, props) {
  const { query } = props.location;
  const joblistings = state.joblistings.items.map(
    id => state.joblistings.byId[id]
  );
  const sortType = query.sort === 'company' ? 'company' : 'deadline';
  const filterClass = query.class ? query.class.split(',') : [];
  const filterJobType = query.jobtypes ? query.jobtypes.split(',') : [];
  const filterWorkplaces = query.workplaces ? query.workplaces.split(',') : [];

  const filteredJoblistings = filterJoblistings(
    joblistings,
    filterClass,
    filterJobType,
    filterWorkplaces
  );
  const sortedJoblistings = sortJoblistings(filteredJoblistings, sortType);

  const actionGrant = state.joblistings.actionGrant;

  return {
    joblistings: sortedJoblistings,
    query,
    actionGrant
  };
}

const mapDispatchToProps = { fetchAll };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate([], loadData)
)(JoblistingsPage);
