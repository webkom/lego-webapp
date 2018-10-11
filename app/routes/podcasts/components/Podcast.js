// @flow

import React, { Component } from 'react';
import styles from './Podcast.css';
import ProgressSoundPlayer from './Player';

type Props = {
  title: string,
  source: string,
  createdAt: string,
  description: string,
  authors: Array<Object>
};

type State = {
  extended: boolean
};

class Podcast extends Component<Props, State> {
  state = {
    extended: false
  };

  render() {
    const CLIENT_ID = 'E8IqLGTYxHll6SyaM7LKrMzKveWkcrjg';

    const { source, createdAt } = this.props;
    return (
      <div className={styles.root}>
        <ProgressSoundPlayer
          createdAt={createdAt}
          clientId={CLIENT_ID}
          resolveUrl={source}
        />
      </div>
    );
  }
}

export default Podcast;
