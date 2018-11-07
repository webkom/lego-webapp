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
import GroupChange from './GroupChange.js';
import styles from './UserProfile.css';
import { Flex } from 'app/components/Layout';
import Tooltip from 'app/components/Tooltip';
import { groupBy } from 'lodash';
import { resolveGroupLink } from 'app/reducers/groups';
import type { Group, AddPenalty, Event, ID } from 'app/models';
import cx from 'classnames';
import { EventItem } from 'app/routes/events/components/EventList';
import EmptyState from 'app/components/EmptyState';
import moment from 'moment-timezone';
import type { Dateish } from 'app/models';
import { Image } from 'app/components/Image';
import frame from 'app/assets/frame.png';

const fieldTranslations = {
  username: 'brukernavn',
  email: 'e-post'
};

type Props = {
  user: any,
  showSettings: boolean,
  feedItems: Array<any>,
  feed: Object,
  isMe: boolean,
  loading: boolean,
  upcomingEvents: Array<Event>,
  addPenalty: AddPenalty => void,
  deletePenalty: number => Promise<*>,
  penalties: Array<Object>,
  canDeletePenalties: boolean,
  groups: Array<Group>,
  canChangeGrade: boolean,
  changeGrade: (ID, string) => Promise<*>
};

type UpcomingEventsProps = {
  upcomingEvents: Array<Event>
};

const GroupPill = ({ group }: { group: Group }) =>
  group.showBadge ? (
    <Pill key={group.id} style={{ margin: '5px' }}>
      {group.name}
    </Pill>
  ) : null;

const BadgeTooltip = ({
  group,
  start,
  end
}: {
  group: Group,
  start: Dateish,
  end: ?Dateish
}) => {
  const startYear = moment(start).year();
  const endYear = end ? moment(end).year() : 'd.d.';
  return `${group.name} (${startYear} - ${endYear})`;
};

const GroupBadge = ({
  group,
  start,
  end
}: {
  group: Group,
  start: Dateish,
  end?: ?Dateish
}) => {
  const groupElement = (
    <Tooltip
      key={group.id}
      content={<BadgeTooltip group={group} end={end} start={start} />}
    >
      <CircularPicture
        alt={group.name}
        src={group.logo}
        size={50}
        style={{
          margin: '10px 5px',
          ...(end ? { filter: 'grayscale(100%)', opacity: '0.7' } : {})
        }}
      />
    </Tooltip>
  );
  const link = resolveGroupLink(group);
  if (!link) {
    return groupElement;
  }
  return (
    group.showBadge && (
      <Link key={group.id} to={resolveGroupLink(group)}>
        {groupElement}
      </Link>
    )
  );
};

const UpcomingEvents = ({ upcomingEvents }: UpcomingEventsProps) => (
  <div>
    {upcomingEvents && upcomingEvents.length ? (
      <Flex column wrap>
        {upcomingEvents.map((event, i) => (
          <EventItem key={i} event={event} showTags={false} />
        ))}
      </Flex>
    ) : (
      <EmptyState>
        <h2 className={styles.emptyState}>
          Du har ingen kommende arrangementer
        </h2>
      </EmptyState>
    )}
  </div>
);

export default class UserProfile extends Component<Props, UpcomingEventsProps> {
  sumPenalties() {
    return sumBy(this.props.penalties, 'weight');
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
    const {
      user,
      isMe,
      showSettings,
      feedItems,
      feed,
      loading,
      upcomingEvents,
      addPenalty,
      deletePenalty,
      penalties,
      canDeletePenalties,
      groups,
      canChangeGrade,
      changeGrade
    } = this.props;

    //If you wonder what this is, ask somebody
    const FRAMEID = 6050;

    const {
      pastMemberships = [],
      abakusGroups = [],
      firstName,
      lastName,
      memberships = []
    } = user;

    const { membershipsAsBadges = [], membershipsAsPills = [] } = groupBy(
      memberships.filter(Boolean).map(membership => ({
        ...membership,
        abakusGroup: abakusGroups.find(g => g.id === membership.abakusGroup)
      })),
      membership =>
        membership.abakusGroup.logo
          ? 'membershipsAsBadges'
          : 'membershipsAsPills'
    );
    const { pastMembershipsAsBadges = [] } = groupBy(
      pastMemberships.filter(Boolean),
      m =>
        m.abakusGroup.logo
          ? 'pastMembershipsAsBadges'
          : 'pastMembershipsAsPills'
    );
    const a = pastMemberships.filter(Boolean).map(m => m.abakusGroup);
    return (
      <div className={styles.root}>
        <Helmet title={`${firstName} ${lastName}`} />

        <Flex wrap className={styles.header}>
          <div className={cx(styles.sidebar, styles.picture)}>
            {user.id == FRAMEID && (
              <Image className={styles.frame} src={frame} />
            )}
            <ProfilePicture user={user} size={150} />
          </div>
          <Flex column className={styles.rightContent}>
            <h2>{user.fullName}</h2>
            <Flex wrap>
              {membershipsAsPills.map(membership => (
                <GroupPill key={membership.id} group={membership.abakusGroup} />
              ))}
            </Flex>
            <Flex>
              {membershipsAsBadges.map(membership => (
                <GroupBadge
                  group={membership.abakusGroup}
                  start={membership.createdAt}
                  key={membership.id}
                />
              ))}
              {pastMembershipsAsBadges.map(membership => (
                <GroupBadge
                  group={membership.abakusGroup}
                  start={membership.startDate}
                  end={membership.endDate}
                  key={membership.id}
                />
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
                <h3>Prikker ({this.sumPenalties()} stk)</h3>
                <Card className={styles.infoCard}>
                  <Penalties
                    penalties={penalties}
                    addPenalty={addPenalty}
                    deletePenalty={deletePenalty}
                    username={user.username}
                    userId={user.id}
                    canDeletePenalties={canDeletePenalties}
                  />
                </Card>
              </div>
            )}

            {canChangeGrade && (
              <div>
                <h3>Endre Klasse</h3>
                <Card className={styles.infoCard}>
                  <GroupChange
                    grades={groups}
                    abakusGroups={abakusGroups}
                    changeGrade={changeGrade}
                    username={user.username}
                  />
                </Card>
              </div>
            )}

            {isMe && user.email !== user.emailAddress && (
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
            {isMe && (
              <div className={styles.bottomMargin}>
                <h3>Dine kommende arrangementer</h3>

                {loading ? (
                  <LoadingIndicator margin={'20px auto'} loading />
                ) : (
                  <UpcomingEvents upcomingEvents={upcomingEvents} />
                )}
              </div>
            )}
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
