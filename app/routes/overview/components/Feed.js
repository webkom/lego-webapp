import React, { Component } from 'react';
import styles from './Feed.css';

const Feed = props => {
  const items = [
    {
      who: 'Orhan',
      what: 'started working for EY.'
    },
    {
      who: 'Larsen',
      what: 'made coffee.'
    },
    {
      who: 'Sylliaas',
      what: 'gave the grandis away.'
    },
    {
      who: 'Donald John Trump',
      what: 'did not make America great again.'
    }
  ];

  return (
    <div className={styles.root}>
      <h2 className="u-ui-heading">Live updates</h2>
      <div className={styles.content}>
        <ul>
          {items.map((item, index) =>
            <li className={styles.item} key={index}>
              <a href="">
                <strong>{item.who}</strong> {item.what}
              </a>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Feed;
