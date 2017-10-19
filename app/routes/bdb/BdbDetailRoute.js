import { connect } from 'react-redux';
import { dispatched } from '@webkom/react-prepare';
import {
  fetch,
  deleteSemesterStatus,
  deleteCompanyContact,
  fetchSemesters,
  editSemesterStatus,
  fetchEventsForCompany,
  editCompany
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
  Promise.all([
    dispatch(fetchSemesters()).then(() => dispatch(fetch(companyId))),
    dispatch(fetchEventsForCompany(companyId))
  ]);

const mapStateToProps = (state, props) => {
  const companyId = Number(props.params.companyId);
  const company = selectCompanyById(state, { companyId });
  const comments = selectCommentsForCompany(state, { companyId });
  const companyEvents = selectEventsForCompany(state, { companyId });
  const companySemesters = selectCompanySemesters(state, props);
  const fetching = state.companies.fetching;
  return {
    company,
    companyId,
    companyEvents,
    comments,
    companySemesters,
    fetching
  };
};

const mapDispatchToProps = {
  deleteSemesterStatus,
  deleteCompanyContact,
  editSemesterStatus,
  editCompany
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  dispatched(loadData, {
    componentWillReceiveProps: false
  }),
  connect(mapStateToProps, mapDispatchToProps)
)(BdbDetail);
