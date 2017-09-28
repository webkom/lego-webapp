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

const GroupSettings = ({ group, updateGroup, initialValues }: Props) => (
  <GroupForm
    group={group}
    handleSubmitCallback={values => {
      // TODO(mht): Fix this
      // updateGroup(123, values);
      console.log('dispatch your action');
    }}
    initialValues={group}
  />
);

export default GroupSettings;
