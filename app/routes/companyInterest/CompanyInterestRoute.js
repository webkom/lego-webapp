import { connect } from 'react-redux';
import { createCompanyInterest } from 'app/actions/CompanyInterestActions';
import { fetchAll } from 'app/actions/SemesterActions';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import { push } from 'react-router-redux';
import CompanyInterestPage from './components/CompanyInterestPage';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import { selectCompanySemesters } from 'app/reducers/companySemesters';

const loadData = (params, props) => props.fetchAll();

const mapStateToProps = state => {
  const semesters = selectCompanySemesters(state);
  return {
    initialValues: {
      semesters
    },
    semesters
  };
};

const mapDispatchToProps = { fetchAll, push, createCompanyInterest };

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
