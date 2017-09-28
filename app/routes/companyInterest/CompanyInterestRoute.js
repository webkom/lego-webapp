import { connect } from 'react-redux';
import { createCompanyInterest } from 'app/actions/CompanyInterestActions';
import { fetchSemesters } from 'app/actions/CompanyActions';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import { push } from 'react-router-redux';
import CompanyInterestPage, { EVENT_TYPES } from './components/CompanyInterestPage';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import { selectCompanySemesters } from 'app/reducers/companySemesters';

const loadData = (params, props) => props.fetchSemesters();

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
  onSubmit: createCompanyInterest,
  fetchSemesters,
  push
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
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
  }),
  fetchOnUpdate(['loggedIn'], loadData)
)(CompanyInterestPage);
