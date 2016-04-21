import Header from './Header';
import { connect } from 'react-redux';
import { login, logout } from 'app/actions/UserActions';
import { search } from 'app/actions/SearchActions';

function mapStateToProps(state) {
  return {
    searchResults: state.search.results,
    searching: state.search.searching,
    auth: state.auth,
    loggedIn: state.auth.token !== null,
    loginFailed: state.auth.loginFailed
  };
}

const mapDispatchToProps = { login, logout, search };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
