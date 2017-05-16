// @flow

import React from 'react';
import { Link } from 'react-router';
import GroupTree from './GroupTree';
import styles from './GroupAdmin.css';

const tabNames = ['Settings', 'Members'];

const Tab = ({ base, name }) => (
  <Link
    className={styles.tab}
    to={`${base}/${name.toLowerCase()}`}
    activeClassName="active"
  >
    {name}
  </Link>
);

const Tabs = ({ location }: { location: Object }) => {
  const { pathname } = location;
  const baseParts = pathname.split('/');
  const base = baseParts.slice(0, baseParts.length - 1).join('/');

  return (
    <header className={styles.tabs}>
      {tabNames.map(name => <Tab key={name} base={base} name={name} />)}
    </header>
  );
};

const GroupPage = ({
  groups,
  children,
  location
}: {
  groups: Object[],
  children: any,
  location: Object
}) => {
  return (
    <div className={styles.GroupPage}>
      <section className={styles.sidebar}>
        <GroupTree groups={groups} />
      </section>

      <section className={styles.main}>
        <Tabs location={location} />
        {children}
      </section>
    </div>
  );
};

export default GroupPage;
