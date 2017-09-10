// @flow
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import {
  editInterestGroup,
  joinInterestGroup
} from 'app/actions/InterestGroupActions';
import InterestGroupEdit from './components/InterestGroupEditor';
import { uploadFile } from 'app/actions/FileActions';

const mapDispatchToProps = {
  editInterestGroup,
  joinInterestGroup,
  uploadFile,
  handleSubmitCallback: editInterestGroup
};

const mapStateToProps = (state, props) => {
  const valueSelector = formValueSelector('interestGroupEditor');
  const interestGroup = state.interestGroups.byId[props.params.interestGroupId];
  return {
    interestGroup,
    initialValues: {
      ...interestGroup,
      members: interestGroup.memberships.map(({ user }) => ({
        value: user.id,
        label: user.fullName
      })),
      leader: interestGroup.memberships
        .filter(m => m.role === 'leader')
        .map(({ user }) => ({ value: user.id, label: user.fullName }))[0]
    },
    groupMembers: valueSelector(state, 'members') || []
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(InterestGroupEdit);
