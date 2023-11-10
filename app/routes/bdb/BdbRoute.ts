import { push } from 'connected-react-router';
import qs from 'qs';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { LoginPage } from 'app/components/LoginForm';
import { selectCompanies } from 'app/reducers/companies';
import { selectCompanySemesters } from 'app/reducers/companySemesters';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import {
  fetchAllAdmin,
  addSemesterStatus,
  editSemesterStatus,
  fetchSemesters,
  addSemester,
} from '../../actions/CompanyActions';
import BdbPage from './components/BdbPage';

const mapStateToProps = (state, props) => ({
  companies: selectCompanies(state, props),
  companySemesters: selectCompanySemesters(state, props),
  query: qs.parse(props.location.search, {
    ignoreQueryPrefix: true,
  }),
  fetching: state.companies.fetching,
});

const mapDispatchToProps = {
  editSemesterStatus,
  addSemesterStatus,
  addSemester,
  push,
};
export default compose(
  replaceUnlessLoggedIn(LoginPage),
  withPreparedDispatch('fetchBdb', (props, dispatch) =>
    dispatch(fetchSemesters()).then(() => dispatch(fetchAllAdmin())),
  ),
  connect(mapStateToProps, mapDispatchToProps),
)(BdbPage);
