// @flow
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';

import { inviteUser } from 'app/actions/SlackActions';
import SlackPage from './components/SlackPage';
import { createValidator, required, isEmail } from 'app/utils/validation';

const validate = createValidator({
  email: [required(), isEmail()]
});

const mapDispatchToProps = { inviteUser };

export default compose(
  connect(null, mapDispatchToProps),
  reduxForm({
    form: 'slack-invite',
    validate,
  })
)(SlackPage);
