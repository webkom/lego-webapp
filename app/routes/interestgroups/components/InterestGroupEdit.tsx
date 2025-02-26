import { LoadingPage, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';
import { fetchGroup } from 'app/actions/GroupActions';
import { selectGroupById } from 'app/reducers/groups';
import GroupForm from 'app/routes/admin/groups/components/GroupForm';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import type { PublicDetailedGroup } from 'app/store/models/Group';

const InterestGroupEdit = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const fetching = useAppSelector((state) => state.groups.fetching);
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
    return <LoadingPage loading={fetching} />;
  }

  const title = editing
    ? `Redigerer${interestGroup ? `: ${interestGroup?.name}` : ''}`
    : 'Opprett gruppe';

  return (
    <Page
      title={title}
      back={{
        href: `/interest-groups/${editing ? groupId : ''}`,
      }}
    >
      <Helmet title={title} />
      <GroupForm isInterestGroup />
    </Page>
  );
};

export default guardLogin(InterestGroupEdit);
