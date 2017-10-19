// @flow
import { connect } from 'react-redux';
import { createCompanyInterest } from 'app/actions/CompanyInterestActions';
import { fetchSemesters } from 'app/actions/CompanyActions';
import { compose } from 'redux';
import { push } from 'react-router-redux';
import CompanyInterestPage, {
  EVENT_TYPES
} from './components/CompanyInterestPage';
import { selectCompanySemesters } from 'app/reducers/companySemesters';
import { dispatched } from '@webkom/react-prepare';

const loadSemesters = (props, dispatch) => dispatch(fetchSemesters());

const mapStateToProps = state => {
  const semesters = selectCompanySemesters(state);
  const allEvents = Object.keys(EVENT_TYPES);
  return {
    initialValues: {
      events: allEvents.map(event => ({
        name: event,
        checked: false
      })),
      semesters
    },
    edit: false
  };
};

const mapDispatchToProps = {
  push,
  onSubmit: createCompanyInterest
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  dispatched(loadSemesters, {
    componentWillReceiveProps: false
  })
)(CompanyInterestPage);
