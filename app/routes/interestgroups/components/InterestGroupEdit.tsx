import { LoadingIndicator } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom-v5-compat';
import { fetchGroup } from 'app/actions/GroupActions';
import { Content } from 'app/components/Content';
import { LoginPage } from 'app/components/LoginForm';
import NavigationTab from 'app/components/NavigationTab';
import { selectIsLoggedIn } from 'app/reducers/auth';
import { selectGroup } from 'app/reducers/groups';
import GroupForm from 'app/routes/admin/groups/components/GroupForm';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';

const InterestGroupEdit = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const interestGroup = useAppSelector((state) =>
    selectGroup(state, { groupId })
  );
  const editing = groupId !== undefined;
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchInterestGroupEdit',
    () => {
      dispatch(fetchGroup(groupId));
    },
    [groupId]
  );

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  if (!interestGroup || !interestGroup.text) {
    return <LoadingIndicator loading />;
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

export default InterestGroupEdit;
