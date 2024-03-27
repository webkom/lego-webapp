import { LoadingIndicator } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { fetchGroup } from 'app/actions/GroupActions';
import { Content } from 'app/components/Content';
import NavigationTab from 'app/components/NavigationTab';
import { selectGroupById } from 'app/reducers/groups';
import GroupForm from 'app/routes/admin/groups/components/GroupForm';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import type { PublicDetailedGroup } from 'app/store/models/Group';

const InterestGroupEdit = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const interestGroup = useAppSelector((state) =>
    selectGroupById<PublicDetailedGroup>(state, groupId),
  );
  const editing = groupId !== undefined;

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchInterestGroupEdit',
    () => groupId && dispatch(fetchGroup(groupId)),
    [groupId],
  );

  if (editing && (!interestGroup || !interestGroup.text)) {
    return (
      <Content>
        <LoadingIndicator loading />
      </Content>
    );
  }

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
      <GroupForm isInterestGroup />
    </Content>
  );
};

export default guardLogin(InterestGroupEdit);
