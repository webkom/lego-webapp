// @flow

import React, { Component } from 'react';
import { Link } from 'react-router';
import { capitalize } from 'lodash';
import ProfilePicture from 'app/components/ProfilePicture';
import Card from 'app/components/Card';
import { FlexRow, FlexItem } from 'app/components/FlexBox';
import styles from './UserProfile.css';
import LoadingIndicator from 'app/components/LoadingIndicator';
import Feed from 'app/components/Feed';

const fieldTranslations = {
  username: 'brukernavn',
  email: 'e-post'
};

type Props = {
  user: any,
  isMe: boolean,
  feedItems: array,
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
      <section className='u-container'>
        <FlexRow className={styles.header}>
          <ProfilePicture
            user={user}
            size={150}
          />

          <h2>{user.fullName}</h2>

          <div>5. Datateknikk</div>
        </FlexRow>

        <FlexRow style={{ padding: 20 }}>
          <FlexItem flex={1}>
            <Card>
              {this.renderFields()}
              {isMe ? <Link to='/users/me/settings'>Settings</Link> : ''}
            </Card>
          </FlexItem>

          <FlexItem flex={2}>
            <div style={{ padding: 20 }}>
              <h2> User feed </h2>
              {
                feed ?
                  <Feed items={feedItems} feed={feed} /> :
                  <LoadingIndicator loading />
              }
            </div>
          </FlexItem>
        </FlexRow>
      </section>
    );
  }
}
