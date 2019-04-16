import { dispatched } from '@webkom/react-prepare';
import { compose } from 'redux';
import { connect } from 'react-redux';
import UserConfirmation from './components/UserConfirmation';
import { createUser, validateRegistrationToken } from 'app/actions/UserActions';

const loadData = (
  {
    location: {
      query: { token }
    }
  },
  dispatch
) => {
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
  dispatched(loadData, { componentWillReceiveProps: false }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(UserConfirmation);
