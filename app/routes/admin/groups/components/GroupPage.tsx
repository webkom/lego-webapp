import { usePreparedEffect } from '@webkom/react-prepare';
import { Helmet } from 'react-helmet-async';
import { Switch, useRouteMatch, useParams, Route } from 'react-router-dom';
import { useLocation } from 'react-router-dom-v5-compat';
import { fetchAll } from 'app/actions/GroupActions';
import { Content } from 'app/components/Content';
import NavigationTab from 'app/components/NavigationTab';
import NavigationLink from 'app/components/NavigationTab/NavigationLink';
import { selectGroups } from 'app/reducers/groups';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import styles from './GroupPage.css';
import GroupTree from './GroupTree';
import GroupView from './GroupView';

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

const GroupPage = () => {
  const { groupId } = useParams<{ groupId?: string }>();

  const groups = useAppSelector((state) => selectGroups(state));

  const location = useLocation();
  const { path } = useRouteMatch();

  const dispatch = useAppDispatch();

  usePreparedEffect('fetchAllGroups', () => dispatch(fetchAll()), []);

  return (
    <Content>
      <Helmet title="Grupper" />
      <GroupPageNavigation groupId={groupId} />
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
            <Route path={path} component={GroupView} />
          </Switch>
        </section>
      </div>
    </Content>
  );
};

export default GroupPage;
