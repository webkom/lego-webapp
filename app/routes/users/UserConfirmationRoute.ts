import qs from 'qs';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { formValueSelector } from 'redux-form';
import { createUser, validateRegistrationToken } from 'app/actions/UserActions';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import UserConfirmation from './components/UserConfirmation';

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
