import prepare from 'app/utils/prepare';
import { compose } from 'redux';
import { connect } from 'react-redux';
import UserConfirmation from './components/UserConfirmation';
import { createUser, validateRegistrationToken } from 'app/actions/UserActions';
import qs from 'qs';

const loadData = ({ location: { search } }, dispatch) => {
  const { token } = qs.parse(search, { ignoreQueryPrefix: true });
  if (token) {
    return dispatch(validateRegistrationToken(token));
  }
};

const mapStateToProps = (state, props) => {
  return { token: state.auth.registrationToken };
};

const mapDispatchToProps = {
  createUser
};

export default compose(
  prepare(loadData),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(UserConfirmation);
