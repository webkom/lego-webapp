import { connect } from 'react-redux';
import { dispatched } from 'react-prepare';
import {
  fetch,
  deleteSemesterStatus,
  deleteCompanyContact,
  fetchSemesters
} from 'app/actions/CompanyActions';
import BdbDetail from './components/BdbDetail';
import { compose } from 'redux';
import {
  selectCompanyById,
  selectEventsForCompany,
  selectCommentsForCompany
} from 'app/reducers/companies';
import { selectCompanySemesters } from 'app/reducers/companySemesters';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';

const loadData = ({ params: { companyId } }, dispatch) =>
  dispatch(fetchSemesters()).then(() => dispatch(fetch(companyId)));

const mapStateToProps = (state, props) => {
  const companyId = Number(props.params.companyId);
  const company = selectCompanyById(state, { companyId });
  const comments = selectCommentsForCompany(state, { companyId });
  const companyEvents = selectEventsForCompany(state, { companyId });
  const companySemesters = selectCompanySemesters(state, props);
  return {
    company,
    companyId,
    companyEvents,
    comments,
    companySemesters
  };
};

const mapDispatchToProps = {
  fetch,
  deleteSemesterStatus,
  deleteCompanyContact,
  fetchSemesters
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  dispatched(loadData, {
    componentWillReceiveProps: false
  }),
  connect(mapStateToProps, mapDispatchToProps)
)(BdbDetail);
