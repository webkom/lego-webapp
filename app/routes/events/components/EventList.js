// @flow

import React, { Component } from 'react';
import Toolbar from './Toolbar';
import styles from './EventList.css';

class EventList extends Component {
  render() {
    return (
      <div className={styles.root}>
        <Toolbar />
        <h2>Event List</h2>
        <p>Hello World</p>
      </div>
    );
  }
}

export default EventList;
