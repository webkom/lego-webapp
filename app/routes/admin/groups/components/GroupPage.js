// @flow

import React from 'react';
import NavigationTab from 'app/components/NavigationTab';
import NavigationLink from 'app/components/NavigationTab/NavigationLink';
import Content from 'app/components/Layout/Content';
import GroupTree from './GroupTree';
import styles from './GroupAdmin.css';

type Props = {
  children: React.Element<*>,
  groups: Array<Object>,
  params: { groupId: string }
};

const GroupPageNavigation = ({ groupId }: { groupId: string }) => {
  const baseUrl = `/admin/groups/${groupId}`;
  return (
    <NavigationTab title="Grupper">
      <NavigationLink to={`${baseUrl}/settings`}>Rediger</NavigationLink>
      <NavigationLink to={`${baseUrl}/members`}>Medlemmer</NavigationLink>
      <NavigationLink to={`${baseUrl}/permissions`}>Rettigheter</NavigationLink>
    </NavigationTab>
  );
};

const GroupPage = ({ groups, children, params }: Props) => {
  return (
    <Content>
      {params.groupId && <GroupPageNavigation groupId={params.groupId} />}
      <div className={styles.groupPage}>
        <section className={styles.sidebar}>
          <GroupTree groups={groups} />
        </section>

        <section className={styles.main}>{children}</section>
      </div>
    </Content>
  );
};

export default GroupPage;
