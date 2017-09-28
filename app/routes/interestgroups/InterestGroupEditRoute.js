// @flow
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import {
  editInterestGroup,
  joinInterestGroup,
  removeInterestGroup
} from 'app/actions/InterestGroupActions';
import { uploadFile } from 'app/actions/FileActions';
import { selectMembershipsForInterestGroup } from 'app/reducers/memberships';
import InterestGroupEdit from './components/InterestGroupEdit';

const mapDispatchToProps = {
  editInterestGroup,
  joinInterestGroup,
  removeInterestGroup,
  uploadFile,
  handleSubmitCallback: editInterestGroup
};

const mapStateToProps = (state, props) => {
  const valueSelector = formValueSelector('interestGroupEditor');
  const interestGroup = state.interestGroups.byId[props.params.interestGroupId];
  const memberships = interestGroup
    ? selectMembershipsForInterestGroup(state, {
        interestGroupId: interestGroup.id
      })
    : [];
  return {
    interestGroup,
    initialValues: {
      ...interestGroup,
      // TODO: remove this
      members: memberships.map(m => {
        const { user } = m;
        return {
          value: user.id,
          label: user.fullName
        };
      }),
      leader: memberships
        .filter(m => m.role === 'leader')
        .map(({ user }) => ({ value: user.id, label: user.fullName }))[0]
    },
    groupMembers: valueSelector(state, 'members') || []
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(InterestGroupEdit);
