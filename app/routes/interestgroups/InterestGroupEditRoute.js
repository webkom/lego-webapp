// @flow
import { compose } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from '@webkom/react-prepare';
import { formValueSelector } from 'redux-form';
import {
  fetchInterestGroup,
  editInterestGroup,
  removeInterestGroup
} from 'app/actions/InterestGroupActions';
import { uploadFile } from 'app/actions/FileActions';
import { selectMembershipsForInterestGroup } from 'app/reducers/memberships';
import { selectGroup } from 'app/reducers/groups';
import InterestGroupEdit from './components/InterestGroupEdit';

const mapDispatchToProps = {
  editInterestGroup,
  removeInterestGroup,
  uploadFile,
  handleSubmitCallback: editInterestGroup
};

const mapStateToProps = (state, props) => {
  const id = props.params.interestGroupId;
  const valueSelector = formValueSelector('interestGroupEditor');
  const interestGroup = selectGroup(state, { groupId: id });

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

export default compose(
  dispatched(
    ({ params: { interestGroupId } }, dispatch) =>
      dispatch(fetchInterestGroup(Number(interestGroupId))),
    {
      componentWillReceiveProps: false
    }
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(InterestGroupEdit);
