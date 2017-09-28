// @flow
import React from 'react';
import { connect } from 'react-redux';
import GroupForm from 'app/components/GroupForm';
import { updateGroup } from 'app/actions/GroupActions';

type Props = {
  group: Object,
  updateGroup: (number, Object) => Promise<*>,
  initialValues: Object
};

const GroupSettings = ({ group, updateGroup, initialValues }: Props) => {
  return (
    <GroupForm
      group={group}
      handleSubmitCallback={values => {
        // TODO(mht): Fix this
        // updateGroup(123, values);
        console.log('dispatch your action');
      }}
      initialValues={initialValues}
    />
  );
};

const mapStateToProps = (state, props) => {
  const groupId = props.groupId;
  if (!groupId) {
    console.log('mapStateToProps: gropuId is falsy: ', groupId);
    return {};
  }
  const group = state.groups.byId[groupId];
  if (!group) {
    console.log('mapStateToProps: group is falsy: ', group);
    return {};
  }
  if (!group.groupText) {
    // We only have a small part of the group object,
    // and we're waiting for the entire thing.
    return {};
  }
  console.log('drittland.group', group);
  return {
    group,
    initialValues: {
      //TODO(mht): fix this wip shit
      groupText: group.groupText.text,
      ...group
    }
  };
};

const mapDispatchToProps = {
  updateGroup
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupSettings);
