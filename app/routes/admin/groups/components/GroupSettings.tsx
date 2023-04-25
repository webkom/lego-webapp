import { connect } from 'react-redux';
import { compose } from 'redux';
import { editGroup } from 'app/actions/GroupActions';
import GroupForm from 'app/components/GroupForm';
import loadingIndicator from 'app/utils/loadingIndicator';

type Props = {
  group: Record<string, any>;
  editGroup: (arg0: any) => Promise<any>;
};

const GroupSettings = ({ group, editGroup }: Props) => (
  <GroupForm
    group={group}
    handleSubmitCallback={editGroup}
    initialValues={group}
  />
);

const mapDispatchToProps = {
  editGroup,
};
export default compose(
  connect(() => ({}), mapDispatchToProps),
  loadingIndicator(['group'])
)(GroupSettings);
