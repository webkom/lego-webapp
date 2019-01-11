// @flow

import React from 'react';
import {
  Link
} from 'react-router';
import {
  Content
} from 'app/components/Content';
import NavigationTab, {
  NavigationLink
} from 'app/components/NavigationTab';
import styles from './PollsList.css'

type props = {
  polls: Array < Object > ,
  actionGrant: Array < String > ,
  fetching: Boolean
};

const PollsList = (props: props, state) => {
  const {
    polls,
    actionGrant,
  } = props;
  return (
    <Content>
      <NavigationTab title="Avstemninger">
        {actionGrant.includes('create') && <NavigationLink to="/polls/new">Lag ny</NavigationLink>}
      </NavigationTab>
      {polls.map(poll => (
        <Link key={poll.id} to={`/polls/${poll.id}`} className={styles.pollItem}>
          <div className={styles.pollListItem}>
            <h3>{poll.title}</h3>
            <div>{poll.description}</div>
          </div>
        </Link>
      ))}
    </Content>
  );
};

export default PollsList;