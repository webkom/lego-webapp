// @flow

import React, { Component } from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import { capitalize } from 'lodash';
import ProfilePicture from 'app/components/ProfilePicture';
import Card from 'app/components/Card';
import Pill from 'app/components/Pill';
import LoadingIndicator from 'app/components/LoadingIndicator';
import Feed from 'app/components/Feed';
import styles from './UserProfile.css';
import { Flex } from 'app/components/Layout';
import Button from 'app/components/Button';

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

const FollowButton = ({ user, isFollowing, followUser, unfollowUser }) => {
  const label = isFollowing ? 'Slutt å følge ' : 'Følg ';
  const onClick = isFollowing ? unfollowUser : followUser;

  return (
    <Button onClick={onClick}>
      {label}
      {user.firstName}
    </Button>
  );
};

export default class UserProfile extends Component {
  props: Props;

  renderFields() {
    const { user } = this.props;
    const fields = Object.keys(fieldTranslations).filter(field => user[field]);
    const tags = fields.map(field => {
      const translation = capitalize(fieldTranslations[field]);
      return (
        <li key={field}>
          <strong>{translation}:</strong> {user[field]}
        </li>
      );
    });

    return <ul>{tags}</ul>;
  }

  render() {
    const {
      user,
      currentUser,
      isMe,
      feedItems,
      feed,
      followUser,
      unfollowUser
    } = this.props;
    if (!user) {
      return <LoadingIndicator loading />;
    }
    const isFollowing = (currentUser.following || []).includes(user.id);

    return (
      <div className={styles.root}>
        <Helmet title={`${user.firstName} ${user.lastName}`} />

        <Flex wrap className={styles.header}>
          <ProfilePicture user={user} size={150} />

          <h2>{user.fullName}</h2>

          <Pill>5. Datateknikk</Pill>
        </Flex>

        <Flex wrap className={styles.content}>
          <div className={styles.sidebar}>
            <Card>
              {this.renderFields()}
              {isMe ? (
                <Link to="/users/me/settings/profile">Settings</Link>
              ) : (
                <FollowButton
                  user={user}
                  isFollowing={isFollowing}
                  followUser={() => followUser(currentUser, user)}
                  unfollowUser={() => unfollowUser(currentUser, user)}
                />
              )}
            </Card>
          </div>

          <div className={styles.feed}>
            <h2>Recent Activity</h2>
            {feed ? (
              <Feed items={feedItems} feed={feed} />
            ) : (
              <LoadingIndicator loading />
            )}
          </div>
        </Flex>
      </div>
    );
  }
}
