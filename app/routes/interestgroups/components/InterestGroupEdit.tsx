import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom-v5-compat';
import { fetchGroup } from 'app/actions/GroupActions';
import { Content } from 'app/components/Content';
import NavigationTab from 'app/components/NavigationTab';
import { selectGroup } from 'app/reducers/groups';
import GroupForm from 'app/routes/admin/groups/components/GroupSettings';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';

const InterestGroupEdit = () => {
  const { groupId } = useParams();
  const interestGroup = useAppSelector((state) =>
    selectGroup(state, { groupId })
  );
  const editing = groupId !== undefined;

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (editing) {
      dispatch(fetchGroup(groupId));
    }
  }, [dispatch, editing, groupId]);

  const title = editing
    ? `Redigerer${interestGroup ? `: ${interestGroup?.name}` : ''}`
    : 'Opprett gruppe';

  return (
    <Content>
      <Helmet title={title} />
      <NavigationTab
        title={title}
        back={{
          label: 'Tilbake',
          path: `/interest-groups/${editing ? groupId : ''}`,
        }}
      />
      <GroupForm />
    </Content>
  );
};

export default InterestGroupEdit;
