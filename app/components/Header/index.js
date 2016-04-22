import Header from './Header';
import { connect } from 'react-redux';
import { login, logout } from 'app/actions/UserActions';

function mapStateToProps(state) {
  return {
    auth: state.auth,
    loggedIn: state.auth.token !== null,
    loginFailed: state.auth.loginFailed
  };
}

const mapDispatchToProps = { login, logout };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
