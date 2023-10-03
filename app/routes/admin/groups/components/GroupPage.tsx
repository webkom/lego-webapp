import { Helmet } from 'react-helmet-async';
import { Route, Switch } from 'react-router-dom';
import { Content } from 'app/components/Content';
import NavigationTab from 'app/components/NavigationTab';
import NavigationLink from 'app/components/NavigationTab/NavigationLink';
import GroupDetailRoute from '../GroupDetailRoute';
import styles from './GroupPage.css';
import GroupTree from './GroupTree';
import type { Location } from 'history';

const NavigationLinks = ({ groupId }: { groupId: string }) => {
  const baseUrl = `/admin/groups/${groupId}`;
  return (
    <>
      <NavigationLink to={`${baseUrl}/settings`}>Rediger</NavigationLink>
      <NavigationLink to={`${baseUrl}/members?descendants=false`}>
        Medlemmer
      </NavigationLink>
      <NavigationLink to={`${baseUrl}/members?descendants=true`}>
        Implisitte medlemmer
      </NavigationLink>
      <NavigationLink to={`${baseUrl}/permissions`}>Rettigheter</NavigationLink>
    </>
  );
};

const SelectGroup = () => (
  <h2
    style={{
      textAlign: 'center',
    }}
  >
    ← Vennligst velg en gruppe fra menyen
  </h2>
);

const GroupPageNavigation = ({
  groupId,
}: {
  groupId: string | null | undefined;
}) => {
  return (
    <NavigationTab title="Grupper">
      {groupId && <NavigationLinks groupId={groupId} />}
    </NavigationTab>
  );
};

type GroupPageProps = {
  groups: Array<Record<string, any>>;
  location: Location;
  match: {
    path: string;
    params: {
      groupId: string;
    };
  };
};

const GroupPage = ({ groups, location, match }: GroupPageProps) => {
  return (
    <Content>
      <Helmet title="Grupper" />
      <GroupPageNavigation groupId={match.params.groupId} />
      <div className={styles.groupPage}>
        <section className={styles.sidebar}>
          <GroupTree
            groups={groups}
            pathname={location.pathname + location.search}
          />
        </section>

        <section className={styles.main}>
          <Switch>
            <Route exact path="/admin/groups" component={SelectGroup} />
            <Route path={`${match.path}`} component={GroupDetailRoute} />
          </Switch>
        </section>
      </div>
    </Content>
  );
};

export default GroupPage;
