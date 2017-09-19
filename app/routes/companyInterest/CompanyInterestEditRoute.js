import { compose } from 'redux';
import { connect } from 'react-redux';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import { fetchAll } from 'app/actions/SemesterActions';
import {
  fetchCompanyInterest,
  updateCompanyInterest
} from 'app/actions/CompanyInterestActions';
import { CompanyInterestEdit, EVENT_TYPES } from './components/CompanyInterestEdit';
import { selectCompanyInterestById } from 'app/reducers/companyInterest';
import { selectSemesters } from 'app/reducers/semesters';
import { reduxForm } from 'redux-form';
import { push } from 'react-router-redux';

const loadData = ({ companyInterestId }, props) =>
  props
    .fetchAll()
    .then(() => props.fetchCompanyInterest(Number(companyInterestId)));

const mapStateToProps = (state, props) => {
  const { companyInterestId } = props.params;
  const company = selectCompanyInterestById(state, { companyInterestId });
  const semesters = selectSemesters(state);
  const events = company.events;
  const allEvents = Object.keys(EVENT_TYPES);
  console.log('company',company);
  console.log('company.events',company.events);
  return {
    initialValues: {
      ...company,
      events: allEvents.map(event => ({
        name: event,
        checked: company.events && company.events.includes(event)
      })),
      semesters: semesters.map(semester => ({
        ...semester,
        checked: company.semesters && company.semesters.includes(semester.id)
      }))
    },
    companyInterestId
  };
};

const mapDispatchToProps = {
  updateCompanyInterest,
  fetchCompanyInterest,
  fetchAll,
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
  fetchOnUpdate(['companyInterestId', 'loggedIn'], loadData)
)(CompanyInterestEdit);
