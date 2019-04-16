
import React from 'react';
import GroupForm from 'app/components/GroupForm';

type Props = {
  group: Object,
  updateGroup: (number, Object) => Promise<*>,
  initialValues: Object
};

const GroupSettings = ({ group, updateGroup, initialValues }: Props) => (
  <GroupForm
    group={group}
    handleSubmitCallback={updateGroup}
    initialValues={group}
  />
);

export default GroupSettings;
