import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import {
  fetchAllAdmin,
  addSemesterStatus,
  editSemesterStatus,
  fetchSemesters,
  addSemester
} from '../../actions/CompanyActions';
import BdbPage from './components/BdbPage';
import { compose } from 'redux';
import { selectCompanies } from 'app/reducers/companies';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { selectCompanySemesters } from 'app/reducers/companySemesters';
import { push } from 'connected-react-router';

const loadData = (props, dispatch) =>
  dispatch(fetchSemesters()).then(() => dispatch(fetchAllAdmin()));

const mapStateToProps = (state, props) => ({
  companies: selectCompanies(state, props),
  companySemesters: selectCompanySemesters(state, props),
  query: props.location.query,
  fetching: state.companies.fetching
});

const mapDispatchToProps = {
  editSemesterStatus,
  addSemesterStatus,
  addSemester,
  push
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare(loadData),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(BdbPage);
