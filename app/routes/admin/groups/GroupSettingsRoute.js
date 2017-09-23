import React, { Component } from 'react';
import { connect } from 'react-redux';
import GroupForm from 'app/components/GroupForm';
import { updateGroup } from 'app/actions/GroupActions';

type Props = {
  group: Object,
  updateGroup: (number, Object) => Promise<*>
};

const GroupSettings = ({ group, updateGroup }: Props) => {
  return (
    <GroupForm
      group={group}
      handleSubmitCallback={values => {
        // TODO(mht): Fix this
        // updateGroup(123, values);
        console.log('dispatch your action');
      }}
    />
  );
};

const mapDispatchToProps = {
  updateGroup
};

export default connect(null, mapDispatchToProps)(GroupSettings);
