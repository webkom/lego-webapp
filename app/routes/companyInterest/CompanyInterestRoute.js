import { connect } from 'react-redux';
import createCompanyInterest from 'app/actions/CompanyInterestActions';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import CompanyInterestPage from './components/CompanyInterestPage';

const mapDispatchToProps = { onSubmit: createCompanyInterest };

export default compose(
  connect(null, mapDispatchToProps),
  reduxForm({
    form: 'CompanyInterestForm'
  })
)(CompanyInterestPage);
