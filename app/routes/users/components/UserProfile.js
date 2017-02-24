// @flow

import React, { Component } from 'react';
import { Link } from 'react-router';
import { capitalize } from 'lodash';
import ProfilePicture from 'app/components/ProfilePicture';
import Card from 'app/components/Card';
import Pill from 'app/components/Pill';
import LoadingIndicator from 'app/components/LoadingIndicator';
import Feed from 'app/components/Feed';
import styles from './UserProfile.css';

const fieldTranslations = {
  username: 'brukernavn',
  email: 'e-post'
};

type Props = {
  user: any,
  isMe: boolean,
  feedItems: Array<any>,
  feed: Object
};

export default class UserProfile extends Component {
  props: Props;

  renderFields() {
    const { user } = this.props;
    const fields = Object.keys(fieldTranslations).filter((field) => user[field]);
    const tags = fields.map((field) => {
      const translation = capitalize(fieldTranslations[field]);
      return (
        <li key={field}>
          <strong>{translation}:</strong> {user[field]}
        </li>
      );
    });

    return (
      <ul>
        {tags}
      </ul>
    );
  }

  render() {
    const { user, isMe, feedItems, feed } = this.props;
    if (!user) {
      return <LoadingIndicator loading />;
    }

    return (
      <div className={styles.root}>
        <div className={styles.header}>
          <ProfilePicture
            user={user}
            size={150}
          />

          <h2>{user.fullName}</h2>

          <Pill>5. Datateknikk</Pill>
        </div>

        <div className={styles.content}>
          <div className={styles.sidebar}>
            <Card>
              {this.renderFields()}
              {isMe ? <Link to='/users/me/settings'>Settings</Link> : ''}
            </Card>
          </div>

          <div className={styles.feed}>
            <h2>Recent Activity</h2>
            {
              feed ?
                <Feed items={feedItems} feed={feed} /> :
                <LoadingIndicator loading />
            }
          </div>
        </div>
      </div>
    );
  }
}
