import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import qs from 'qs';
import { compose } from 'redux';

import { LoginPage } from 'app/components/LoginForm';
import { selectCompanies } from 'app/reducers/companies';
import { selectCompanySemesters } from 'app/reducers/companySemesters';
import prepare from 'app/utils/prepare';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import {
  addSemester,
  addSemesterStatus,
  editSemesterStatus,
  fetchAllAdmin,
  fetchSemesters,
} from '../../actions/CompanyActions';
import BdbPage from './components/BdbPage';

const loadData = (props, dispatch) =>
  dispatch(fetchSemesters()).then(() => dispatch(fetchAllAdmin()));

const mapStateToProps = (state, props) => ({
  companies: selectCompanies(state, props),
  companySemesters: selectCompanySemesters(state, props),
  query: qs.parse(props.location.search, { ignoreQueryPrefix: true }),
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
  prepare(loadData),
  connect(mapStateToProps, mapDispatchToProps)
)(BdbPage);
