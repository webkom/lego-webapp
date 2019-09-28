// @flow

import React, { type Node } from 'react';
import NavigationTab from 'app/components/NavigationTab';
import NavigationLink from 'app/components/NavigationTab/NavigationLink';
import { Content } from 'app/components/Content';
import GroupTree from './GroupTree';
import styles from './GroupPage.css';
import { Route, Switch } from 'react-router-dom';
import SelectGroup from '../components/SelectGroup';
import GroupDetailRoute from '../GroupDetailRoute';

const NavigationLinks = ({ groupId }: { groupId: string }) => {
  const baseUrl = `/admin/groups/${groupId}`;
  return (
    <div>
      <NavigationLink to={`${baseUrl}/settings`}>Rediger</NavigationLink>
      <NavigationLink to={`${baseUrl}/members`}>Medlemmer</NavigationLink>
      <NavigationLink to={`${baseUrl}/permissions`}>Rettigheter</NavigationLink>
    </div>
  );
};

const GroupPageNavigation = ({ groupId }: { groupId: ?string }) => {
  return (
    <NavigationTab title="Grupper">
      {groupId && <NavigationLinks groupId={groupId} />}
    </NavigationTab>
  );
};

type GroupPageProps = {
  children: Node,
  groups: Array<Object>,
  location: { pathname: string },
  params: { groupId: string }
};

const GroupPage = ({ groups, children, location, match }: GroupPageProps) => {
  return (
    <Content>
      <GroupPageNavigation groupId={match.params.groupId} />
      <div className={styles.groupPage}>
        <section className={styles.sidebar}>
          <GroupTree groups={groups} pathname={location.pathname} />
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
