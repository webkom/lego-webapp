import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, reset, change } from 'redux-form';
import { createValidator, required, maxLength } from 'app/utils/validation';
import { sendContactMessage } from 'app/actions/ContactActions';
import { addToast } from 'app/actions/ToastActions';
import { selectGroupsWithType } from 'app/store/slices/groupsSlice';
import { fetchAllWithType } from 'app/actions/GroupActions';
import { GroupTypeCommittee } from 'app/models';
import Contact from './components/Contact';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';

const validate = createValidator({
  recipient_group: [required()],
  title: [required(), maxLength(80)],
  message: [required()],
  captchaResponse: [required('Captcha er ikke validert')],
});
const groupType = GroupTypeCommittee;

const mapStateToProps = (state, props) => {
  const groups = selectGroupsWithType(state, {
    groupType,
  });
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
  withPreparedDispatch('fetchContact', (_, dispatch) =>
    dispatch(fetchAllWithType(groupType))
  ),
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
