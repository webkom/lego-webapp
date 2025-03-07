import { LoadingPage, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Helmet } from 'react-helmet-async';
import GroupForm from '~/pages/(migrated)/admin/groups/@groupId/settings/+Page';
import { fetchGroup } from '~/redux/actions/GroupActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectGroupById } from '~/redux/slices/groups';
import { guardLogin } from '~/utils/replaceUnlessLoggedIn';
import { useParams } from '~/utils/useParams';
import type { PublicDetailedGroup } from '~/redux/models/Group';

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
