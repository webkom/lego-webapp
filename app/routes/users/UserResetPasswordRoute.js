// @flow
import { connect } from 'react-redux';
import UserResetPassword from './components/UserResetPassword';
import { resetPassword } from 'app/actions/UserActions';
import qs from 'qs';
import { push } from 'connected-react-router';

const mapStateToProps = (state, { location: { search } }) => {
  const { token } = qs.parse(search, { ignoreQueryPrefix: true });
  return { token };
};

const mapDispatchToProps = {
  resetPassword,
  push
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserResetPassword);
