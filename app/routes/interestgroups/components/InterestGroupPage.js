import styles from './InterestGroup.css';
import React, { Component } from 'react';
import InterestGroup from './InterestGroup';


class InterestGroupPage extends Component {
  render() {
    console.log(this.props);
    const groups = this.props.interestGroups.map((group, key) => (
      <InterestGroup
        group={group}
        key={key}
      />
    ));
    return (
      <div className={styles.root}>
        <div className='groups'>
          {groups}
        </div>
      </div>
    );
  }
}

export default InterestGroupPage;
