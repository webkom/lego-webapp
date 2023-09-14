import qs from 'qs';
import { connect } from 'react-redux';
import { push } from 'redux-first-history';
import { resetPassword } from 'app/actions/UserActions';
import UserResetPasswordForm from './components/UserResetPassword';

const mapStateToProps = (state, { location: { search } }) => {
  const { token } = qs.parse(search, {
    ignoreQueryPrefix: true,
  });
  return {
    token,
  };
};

const mapDispatchToProps = {
  resetPassword,
  push,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserResetPasswordForm);
