import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm, reset, change } from 'redux-form';
import { sendContactMessage } from 'app/actions/ContactActions';
import { fetchAllWithType } from 'app/actions/GroupActions';
import { addToast } from 'app/actions/ToastActions';
import { GroupType } from 'app/models';
import { selectGroupsWithType } from 'app/reducers/groups';
import { createValidator, required, maxLength } from 'app/utils/validation';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import Contact from './components/Contact';

const validate = createValidator({
  recipient_group: [required()],
  title: [required(), maxLength(80)],
  message: [required()],
  captchaResponse: [required('Captcha er ikke validert')],
});
const groupType = GroupType.Committee;

const mapStateToProps = (state) => {
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
