// @flow

import React, { Component } from 'react';
import Toolbar from './Toolbar';
import styles from './EventList.css';

class EventList extends Component {
  render() {
    const { events } = this.props;
    return (
      <div className={styles.root}>
        <Toolbar />
        <h2 className={styles.periodHeading}>This week</h2>
        {events.slice(0, 2).map((event) => (
          <div>
            <pre>{JSON.stringify(event, null, 2)}</pre>
          </div>
        ))}

        <h2 className={styles.periodHeading}>Next Week</h2>

        <h2 className={styles.periodHeading}>Later</h2>
      </div>
    );
  }
}

export default EventList;
