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
        <h2>Event List</h2>
        {events.map((event) => (
          <div>
            <pre>{JSON.stringify(event, null, 2)}</pre>
          </div>
        ))}
      </div>
    );
  }
}

export default EventList;
