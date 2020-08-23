// @flow
import React from 'react';
import GroupForm from 'app/components/GroupForm';
import loadingIndicator from 'app/utils/loadingIndicator';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { editGroup } from 'app/actions/GroupActions';

type Props = {
  group: Object,
  editGroup: (any) => Promise<*>,
};

const GroupSettings = ({ group, editGroup }: Props) => (
  <GroupForm
    group={group}
    handleSubmitCallback={editGroup}
    initialValues={group}
  />
);

const mapDispatchToProps = { editGroup };

export default compose(
  connect(() => ({}), mapDispatchToProps),
  loadingIndicator(['group'])
)(GroupSettings);
