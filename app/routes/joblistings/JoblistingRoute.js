import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import { fetchAll } from 'app/actions/JoblistingActions';
import JoblistingPage from './components/JoblistingPage';
import { compose } from 'redux';
import moment from 'moment-timezone';

function filterJoblistings(joblistings, grades, jobTypes, workplaces) {
  return joblistings.filter(joblisting => {
    const gradeBoolean =
      grades.length === 0 ||
      grades.find(
        grade =>
          joblisting.fromYear <= Number(grade) &&
          joblisting.toYear >= Number(grade)
      );

    const jobTypesBoolean =
      jobTypes.length === 0 ||
      jobTypes.find(jobType => jobType === joblisting.jobType);

    const workplacesBoolean =
      workplaces.length === 0 ||
      joblisting.workplaces.some(workplace =>
        workplaces.includes(workplace.town)
      ) ||
      (workplaces.includes('Annet') &&
        joblisting.workplaces.some(
          workplace =>
            !['Oslo', 'Trondheim', 'Bergen', 'Tromsø'].includes(workplace.town)
        ));

    return gradeBoolean && jobTypesBoolean && workplacesBoolean;
  });
}

const dateSort = (a, b) => {
  const date1 = moment(a.deadline);
  const date2 = moment(b.deadline);
  return date1.isAfter(date2) ? 1 : -1;
};

const companySort = (a, b) => a.company.name.localeCompare(b.company.name);

const sortJoblistings = (joblistings, sortType) => {
  return joblistings.sort(sortType === 'company' ? companySort : dateSort);
};

const mapStateToProps = (state, props) => {
  const { query } = props.location;
  const joblistings = state.joblistings.items.map(
    id => state.joblistings.byId[id]
  );
  const sortType = query.order;
  const filterGrade = query.grades ? query.grades.split(',') : [];
  const filterJobType = query.jobTypes ? query.jobTypes.split(',') : [];
  const filterWorkplaces = query.workplaces ? query.workplaces.split(',') : [];

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
    query,
    actionGrant
  };
};

const mapDispatchToProps = { fetchAll };

export default compose(
  prepare((props, dispatch) => dispatch(fetchAll())),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(JoblistingPage);
