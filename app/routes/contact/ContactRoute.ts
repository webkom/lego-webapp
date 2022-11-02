// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, reset, change } from 'redux-form';

import { createValidator, required, maxLength } from 'app/utils/validation';
import { sendContactMessage } from 'app/actions/ContactActions';
import { addToast } from 'app/actions/ToastActions';
import { selectGroupsWithType } from 'app/reducers/groups';
import { fetchAllWithType } from 'app/actions/GroupActions';
import prepare from 'app/utils/prepare';
import { GroupTypeCommittee } from 'app/models';
import Contact from './components/Contact';

const validate = createValidator({
  recipient_group: [required()],
  title: [required(), maxLength(80)],
  message: [required()],
  captchaResponse: [required('Captcha er ikke validert')],
});
const groupType = GroupTypeCommittee;

const loadData = (props, dispatch) => dispatch(fetchAllWithType(groupType));

const mapStateToProps = (state, props) => {
  const groups = selectGroupsWithType(state, { groupType });
  return {
    groups,
  };
};

const mapDispatchToProps = {
  sendContactMessage,
  addToast,
  reset,
  change,
};

export default compose(
  prepare(loadData),
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'contactForm',
    validate,
    enableReinitialize: true,
    initialValues: {
      anonymous: false,
    },
  })
)(Contact);
