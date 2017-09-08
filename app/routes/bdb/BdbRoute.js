import { connect } from 'react-redux';
import { dispatched } from 'react-prepare';
import {
  fetchAll,
  addSemesterStatus,
  editSemesterStatus
} from '../../actions/CompanyActions';
import BdbPage from './components/BdbPage';
import { compose } from 'redux';
import { selectCompanies } from 'app/reducers/companies';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';

const mapStateToProps = (state, props) => ({
  companies: selectCompanies(state, props),
  query: props.location
});

const mapDispatchToProps = { fetchAll, editSemesterStatus, addSemesterStatus };

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  dispatched((props, dispatch) => dispatch(fetchAll()), {
    componentWillReceiveProps: false
  }),
  connect(mapStateToProps, mapDispatchToProps)
)(BdbPage);
