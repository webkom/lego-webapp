
import { connect } from 'react-redux';
import UserResetPassword from './components/UserResetPassword';
import { resetPassword } from 'app/actions/UserActions';

const mapStateToProps = (state, { location: { query: token } }) => {
  return { token: token.token };
};

const mapDispatchToProps = {
  resetPassword
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserResetPassword);
