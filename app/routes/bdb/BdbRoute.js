import { connect } from 'react-redux';
import { dispatched } from 'react-prepare';
import {
  fetchAll,
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

const loadData = (props, dispatch) =>
  dispatch(fetchSemesters()).then(() => dispatch(fetchAll()));

const mapStateToProps = (state, props) => ({
  companies: selectCompanies(state, props),
  companySemesters: selectCompanySemesters(state, props),
  query: props.location.query
});

const mapDispatchToProps = {
  fetchAll,
  fetchSemesters,
  editSemesterStatus,
  addSemesterStatus,
  addSemester
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  dispatched(loadData, {
    componentWillReceiveProps: true
  }),
  connect(mapStateToProps, mapDispatchToProps)
)(BdbPage);
