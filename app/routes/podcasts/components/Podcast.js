// @flow

import React, { Component } from 'react';
import styles from './Podcast.css';
import LegoSoundCloudPlayer from './PodcastPlayer.js';
import { Link } from 'react-router';
import Icon from 'app/components/Icon';

type Props = {
  id: number,
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

  showMore = () => {
    this.setState({
      extended: !this.state.extended
    });
  };

  render() {
    const CLIENT_ID = 'E8IqLGTYxHll6SyaM7LKrMzKveWkcrjg';

    const { id, source, createdAt, description, authors } = this.props;
    const talking = authors.map(author => {
      return (
        <span key={author.id} className={styles.names}>
          <Link to={`/users/${author.username}`}>{author.fullName}</Link>
        </span>
      );
    });

    return (
      <div className={styles.root}>
        <LegoSoundCloudPlayer
          id={id}
          createdAt={createdAt}
          clientId={CLIENT_ID}
          resolveUrl={source}
        />
        {this.state.extended && (
          <div className={styles.more}>
            <p style={{ fontWeight: 'bold' }}>Snakker: {talking}</p>
            <p style={{ textAlign: 'justify' }}>{description}</p>
          </div>
        )}

        <div className={styles.showMore}>
          {this.state.extended ? (
            <Icon
              onClick={this.showMore}
              className={styles.arrow}
              size={20}
              name="arrow-up"
            />
          ) : (
            <Icon
              onClick={this.showMore}
              className={styles.arrow}
              size={20}
              name="arrow-down"
            />
          )}
        </div>
      </div>
    );
  }
}

export default Podcast;
