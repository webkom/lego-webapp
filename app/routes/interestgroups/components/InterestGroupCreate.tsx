import { Helmet } from 'react-helmet-async';
import { Content } from 'app/components/Content';
import { LoginPage } from 'app/components/LoginForm';
import NavigationTab from 'app/components/NavigationTab';
import { selectIsLoggedIn } from 'app/reducers/auth';
import GroupForm from 'app/routes/admin/groups/components/GroupForm';
import { useAppSelector } from 'app/store/hooks';

const InterestGroupCreate = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  return (
    <Content>
      <Helmet title="Opprett interessegruppe" />
      <NavigationTab
        title="Opprett interessegruppe"
        back={{
          label: 'Tilbake',
          path: '/interest-groups',
        }}
      />

      <GroupForm isInterestGroup />
    </Content>
  );
};

export default InterestGroupCreate;
