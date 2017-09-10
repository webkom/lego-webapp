import { connect } from 'react-redux';
import {
  updateCompanyInterest,
  fetchCompanyInterest
} from 'app/actions/CompanyInterestActions';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import CompanyInterestPage from './components/CompanyInterestPage';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import { selectCompanyInterestById } from 'app/reducers/companyInterest';

function loadData({ companyInterestId }, props) {
  props.fetchCompanyInterest(Number(companyInterestId));
}

function mapStateToProps(state, props) {
  const { companyInterestId } = props.params;
  const company = selectCompanyInterestById(state, { companyInterestId });

  return {
    initialValues: company,
    companyInterestId
  };
}

const mapDispatchToProps = {
  onSubmit: updateCompanyInterest,
  fetchCompanyInterest
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
        errors.contactPerson = 'Skriv noe dritt';
      }

      return errors;
    }
  }),
  fetchOnUpdate(['companyInterestId', 'loggedIn'], loadData)
)(CompanyInterestPage);
