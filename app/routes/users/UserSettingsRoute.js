// @flow

import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import UserSettings from './components/UserSettings';
import { updateUser } from 'app/actions/UserActions';
import { createValidator, required, isEmail } from 'app/utils/validation';

const validate = createValidator({
  username: [required()],
  firstName: [required()],
  lastName: [required()],
  gender: [required()],
  email: [required(), isEmail()]
});

function mapStateToProps(state) {
  const user = state.auth.username ? state.users.byId[state.auth.username] : {};
  return {
    user,
    initialValues: user
  };
}

const mapDispatchToProps = { updateUser };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'contact',
    validate,
    enableReinitialize: true
  })
)(UserSettings);
