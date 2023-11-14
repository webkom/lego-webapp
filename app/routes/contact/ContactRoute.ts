import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm, reset, change } from 'redux-form';
import { sendContactMessage } from 'app/actions/ContactActions';
import { fetchAllWithType, fetchGroup } from 'app/actions/GroupActions';
import { addToast } from 'app/actions/ToastActions';
import { GroupType } from 'app/models';
import { selectGroup, selectGroupsWithType } from 'app/reducers/groups';
import { createValidator, required, maxLength } from 'app/utils/validation';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import Contact from './components/Contact';

const validate = createValidator({
  recipient_group: [required()],
  title: [required(), maxLength(80)],
  message: [required()],
  captchaResponse: [required('Captcha er ikke validert')],
});

const commiteeGroupType = GroupType.Committee;
const revueBoardGroupId = 59;

const mapStateToProps = (state) => {
  const commitees = selectGroupsWithType(state, {
    groupType: commiteeGroupType,
  });

  const revueBoard = selectGroup(state, {
    groupId: revueBoardGroupId,
  });

  return {
    groups: [...commitees, revueBoard],
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
    Promise.all([
      dispatch(fetchAllWithType(commiteeGroupType)),
      dispatch(fetchGroup(revueBoardGroupId)),
    ])
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
