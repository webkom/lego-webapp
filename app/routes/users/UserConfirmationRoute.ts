import { compose } from 'redux';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import UserConfirmation from './components/UserConfirmation';
import { createUser, validateRegistrationToken } from 'app/actions/UserActions';
import qs from 'qs';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';

const loadData = ({ location: { search } }, dispatch) => {
  const { token } = qs.parse(search, {
    ignoreQueryPrefix: true,
  });

  if (token) {
    return dispatch(validateRegistrationToken(token));
  }
};

const mapStateToProps = (state, props) => {
  const valueSelector = formValueSelector('ConfirmationForm');
  return {
    token: state.auth.registrationToken,
    user: {
      username: valueSelector(state, 'username'),
      firstName: valueSelector(state, 'firstName'),
      lastName: valueSelector(state, 'lastName'),
      allergies: valueSelector(state, 'allergies'),
    },
  };
};

const mapDispatchToProps = {
  createUser,
};
export default compose(
  withPreparedDispatch('fetchUserConfirmation', loadData),
  connect(mapStateToProps, mapDispatchToProps)
)(UserConfirmation);
