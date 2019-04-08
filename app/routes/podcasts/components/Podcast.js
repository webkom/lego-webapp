// @flow

import React, { Component } from 'react';
import styles from './Podcast.css';
import LegoSoundCloudPlayer from './PodcastPlayer.js';
import { Link } from 'react-router-dom';
import Icon from 'app/components/Icon';
import { ProfilePicture } from 'app/components/Image';

type Props = {
  id: number,
  source: string,
  createdAt: string,
  description: string,
  authors: Array<Object>,
  thanks: Array<Object>,
  actionGrant: Array<String>
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
    const CLIENT_ID = 'WOwjzZGoYrSrOOAILojG4miJtS4pZjSg';

    const {
      id,
      source,
      description,
      authors,
      thanks,
      actionGrant
    } = this.props;

    const authorsSpan = authors.map(user => {
      return (
        <span key={user.id} className={styles.names}>
          <Link
            to={`/users/${user.username}`}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <ProfilePicture
              size={40}
              user={user}
              style={{ marginRight: '10px' }}
            />
            {user.fullName}
          </Link>
        </span>
      );
    });

    const thanksSpan = thanks.map(user => {
      return (
        <span key={user.id} className={styles.names}>
          <Link
            to={`/users/${user.username}`}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <ProfilePicture
              size={40}
              user={user}
              style={{ marginRight: '10px' }}
            />
            {user.fullName}
          </Link>
        </span>
      );
    });

    return (
      <div className={styles.root}>
        <div>
          <LegoSoundCloudPlayer
            id={id}
            clientId={CLIENT_ID}
            resolveUrl={source}
            actionGrant={actionGrant}
          />
        </div>
        {this.state.extended && (
          <div className={styles.more}>
            <div className={styles.talking}>
              <span className={styles.init}>Snakker</span> {authorsSpan}
            </div>
            <p style={{ textAlign: 'justify', marginBottom: '0' }}>
              <span className={styles.init}>Om </span>
              {description}
            </p>
            <div className={styles.talking}>
              <span className={styles.init}>Takk til</span> {thanksSpan}
            </div>
          </div>
        )}
        <div className={styles.showMore} onClick={this.showMore}>
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
