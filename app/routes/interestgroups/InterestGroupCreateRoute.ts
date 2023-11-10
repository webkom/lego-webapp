import { connect } from 'react-redux';
import { compose } from 'redux';
import { formValueSelector } from 'redux-form';
import { uploadFile } from 'app/actions/FileActions';
import { createGroup, joinGroup } from 'app/actions/GroupActions';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import InterestGroupCreate from './components/InterestGroupCreate';

const mapDispatchToProps = {
  createGroup,
  joinGroup,
  uploadFile,
  handleSubmitCallback: (group) => createGroup({ ...group, type: 'interesse' }),
};

const mapStateToProps = (state) => {
  const valueSelector = formValueSelector('interestGroupEditor');
  return {
    initialValues: {
      text: '',
      showBadge: true,
      active: true,
    },
    groupMembers: valueSelector(state, 'members') || [],
  };
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  connect(mapStateToProps, mapDispatchToProps),
)(InterestGroupCreate);
