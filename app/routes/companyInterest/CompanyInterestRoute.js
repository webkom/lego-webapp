// @flow
import { connect } from 'react-redux';
import { createCompanyInterest } from 'app/actions/CompanyInterestActions';
import { fetchSemesters } from 'app/actions/CompanyActions';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import { push } from 'react-router-redux';
import CompanyInterestPage, {
  EVENT_TYPES
} from './components/CompanyInterestPage';
import { selectCompanySemesters } from 'app/reducers/companySemesters';
import { dispatched } from 'react-prepare';

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
  }),
  reduxForm({
    form: 'CompanyInterestForm',
    validate(values) {
      const errors = {};
      if (!values.companyName) {
        errors.companyName = 'Du må gi møtet en tittel';
      }
      if (!values.contactPerson) {
        errors.contactPerson = 'Du må oppgi en kontaktperson!';
      }
      if (!values.mail) {
        errors.mail = 'Du må oppgi mail!';
      }

      return errors;
    },
    enableReinitialize: true
  })
)(CompanyInterestPage);
