// @flow

import React, { Component } from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import { capitalize } from 'lodash';
import { ProfilePicture, CircularPicture } from 'app/components/Image';
import Card from 'app/components/Card';
import Pill from 'app/components/Pill';
import LoadingIndicator from 'app/components/LoadingIndicator';
import Feed from 'app/components/Feed';
import styles from './UserProfile.css';
import { Flex } from 'app/components/Layout';
import Tooltip from 'app/components/Tooltip';
import { groupBy } from 'lodash';

const fieldTranslations = {
  username: 'brukernavn',
  email: 'e-post'
};

type Props = {
  user: any,
  showSettings: boolean,
  feedItems: Array<any>,
  feed: Object,
  isMe: Boolean
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
    const { user, showSettings, feedItems, feed } = this.props;
    const abakusGroups = groupBy(
      user.abakusGroups,
      group => (group.logo ? 'withLogo' : 'withoutLogo')
    );
    return (
      <div className={styles.root}>
        <Helmet title={`${user.firstName} ${user.lastName}`} />

        <Flex wrap className={styles.header}>
          <Flex className={styles.left}>
            <ProfilePicture user={user} size={150} />

            <Flex column className={styles.primaryInfo}>
              <h2 style={{ marginBottom: '15px' }}>{user.fullName}</h2>

              <Flex wrap className={styles.pills}>
                {(abakusGroups['withoutLogo'] || []).map(group => (
                  <Pill key={group.id} className={styles.pill}>
                    {group.name}
                  </Pill>
                ))}
              </Flex>
              <Flex>
                {(abakusGroups['withLogo'] || []).map(group => (
                  <Tooltip key={group.id} content={group.name}>
                    <CircularPicture
                      src={group.logo}
                      size={50}
                      style={{ margin: '10px 5px' }}
                    />
                  </Tooltip>
                ))}
              </Flex>
            </Flex>
          </Flex>
          <Card className={styles.card}>
            {this.renderFields()}
            {showSettings ? (
              <Link to={`/users/${user.username}/settings/profile`}>
                Innstillinger
              </Link>
            ) : (
              ''
            )}
          </Card>
        </Flex>

        <Flex wrap className={styles.content}>
          <div className={styles.feed}>
            <h2>Nylig Aktivitet</h2>
            {feed ? (
              <Feed items={feedItems} feed={feed} />
            ) : (
              <LoadingIndicator loading />
            )}
          </div>
          <Flex style={{ maxWidth: '300px', marginTop: '43px' }}>
            {this.props.isMe &&
              this.props.user.email !== this.props.user.emailAddress && (
                <Card style={{ marginTop: '20px' }}>
                  <h3>Google GSuite</h3>
                  <p>
                    Din konto er linket opp mot Abakus sitt domene i Google
                    GSuite. E-post sendes til denne brukeren og ikke til
                    e-posten du har oppgitt i din profil.
                  </p>

                  <ul>
                    <li>
                      <b>URL:</b>{' '}
                      <a href="http://mail.abakus.no">mail.abakus.no</a>
                    </li>
                    <li>
                      <b>E-post:</b> {this.props.user.emailAddress}
                    </li>
                    <li>
                      <b>Passord:</b> <i>Ditt abakus passord</i>
                    </li>
                  </ul>
                </Card>
              )}
          </Flex>
        </Flex>
      </div>
    );
  }
}
