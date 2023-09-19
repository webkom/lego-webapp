import { LoadingIndicator } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { fetchGroup } from 'app/actions/GroupActions';
import { Content } from 'app/components/Content';
import { LoginPage } from 'app/components/LoginForm';
import NavigationTab from 'app/components/NavigationTab';
import { selectIsLoggedIn } from 'app/reducers/auth';
import { selectGroup } from 'app/reducers/groups';
import GroupForm from 'app/routes/admin/groups/components/GroupForm';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';

const InterestGroupEdit = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const { groupId } = useParams<{ groupId: string }>();
  const interestGroup = useAppSelector((state) =>
    selectGroup(state, { groupId })
  );

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

  return (
    <Content>
      <Helmet title={`Redigerer: ${interestGroup.name}`} />
      <NavigationTab
        title={`Redigerer: ${interestGroup.name}`}
        back={{
          label: 'Tilbake',
          path: `/interest-groups/${interestGroup.id}`,
        }}
      />
      <GroupForm isInterestGroup />
    </Content>
  );
};

export default InterestGroupEdit;
