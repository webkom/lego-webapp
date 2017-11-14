// @flow

import React, { Component } from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import { capitalize, sumBy } from 'lodash';
import { ProfilePicture, CircularPicture } from 'app/components/Image';
import Card from 'app/components/Card';
import Pill from 'app/components/Pill';
import LoadingIndicator from 'app/components/LoadingIndicator';
import Feed from 'app/components/Feed';
import Penalties from './Penalties';
import styles from './UserProfile.css';
import { Flex } from 'app/components/Layout';
import Tooltip from 'app/components/Tooltip';
import { groupBy } from 'lodash';
import cx from 'classnames';

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

export default class UserProfile extends Component<Props> {
  sumPenalties() {
    return sumBy(this.props.user.penalties, 'weight');
  }

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
    const { user, isMe, showSettings, feedItems, feed } = this.props;
    const abakusGroups = groupBy(
      user.abakusGroups,
      group => (group.logo ? 'withLogo' : 'withoutLogo')
    );
    return (
      <div className={styles.root}>
        <Helmet title={`${user.firstName} ${user.lastName}`} />

        <Flex wrap className={styles.header}>
          <div className={cx(styles.sidebar, styles.picture)}>
            <ProfilePicture user={user} size={150} />
          </div>
          <Flex column className={styles.rightContent}>
            <h2>{user.fullName}</h2>
            <Flex wrap>
              {(abakusGroups['withoutLogo'] || []).map(group => (
                <Pill key={group.id} style={{ margin: '5px' }}>
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

        <Flex wrap className={styles.content}>
          <div className={styles.info}>
            <div>
              <h3>Brukerinfo</h3>
              <Card className={styles.infoCard}>
                {this.renderFields()}
                {showSettings ? (
                  <Link to={`/users/${user.username}/settings/profile`}>
                    Innstillinger
                  </Link>
                ) : (
                  ''
                )}
              </Card>
            </div>

            {showSettings && (
              <div>
                <h3>Prikker ({this.sumPenalties()})</h3>
                <Card className={styles.infoCard}>
                  <Penalties penalties={user.penalties} />
                </Card>
              </div>
            )}

            {isMe &&
              user.email !== user.emailAddress && (
                <div>
                  <h3>Google GSuite</h3>
                  <Card className={styles.infoCard}>
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
                        <b>E-post:</b> {user.emailAddress}
                      </li>
                      <li>
                        <b>Passord:</b> <i>Ditt abakus passord</i>
                      </li>
                    </ul>
                  </Card>
                </div>
              )}
          </div>

          <div className={styles.rightContent}>
            <h3>Nylig Aktivitet</h3>
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
