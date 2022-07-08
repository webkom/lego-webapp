// @flow

import { connect } from 'react-redux';
import { compose } from 'redux';
import { change, reduxForm, reset } from 'redux-form';

import { sendContactMessage } from 'app/actions/ContactActions';
import { fetchAllWithType } from 'app/actions/GroupActions';
import { addToast } from 'app/actions/ToastActions';
import { GroupTypeCommittee } from 'app/models';
import { selectGroupsWithType } from 'app/reducers/groups';
import prepare from 'app/utils/prepare';
import { createValidator, maxLength, required } from 'app/utils/validation';
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
