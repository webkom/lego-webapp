// @flow

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';
import { sumBy } from 'lodash';
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
import { groupBy, orderBy } from 'lodash';
import { resolveGroupLink } from 'app/reducers/groups';
import type { Group, AddPenalty, Event, ID } from 'app/models';
import cx from 'classnames';
import EventItem from 'app/components/EventItem';
import EmptyState from 'app/components/EmptyState';
import moment from 'moment-timezone';
import type { Dateish } from 'app/models';
import { Image } from 'app/components/Image';
import frame from 'app/assets/frame.png';

const fieldTranslations = {
  username: 'Brukernavn',
  email: 'E-post',
  internalEmailAddress: 'Abakus e-post'
};

const defaultFieldRender = (field, value) => (
  <span>
    <strong>{field}:</strong> {value}
  </span>
);

const emailFieldRender = (field, value) => (
  <span>
    <strong>{field}:</strong>
    <a href={`mailto:${value}`}> {value}</a>
  </span>
);

const fieldRenders = {
  username: defaultFieldRender,
  email: emailFieldRender,
  internalEmailAddress: emailFieldRender
};

type Props = {
  user: any,
  showSettings: boolean,
  feedItems: Array<any>,
  feed: Object,
  isMe: boolean,
  loggedIn: boolean,
  loading: boolean,
  previousEvents: Array<Event>,
  upcomingEvents: Array<Event>,
  addPenalty: AddPenalty => void,
  deletePenalty: number => Promise<*>,
  penalties: Array<Object>,
  canDeletePenalties: boolean,
  groups: Array<Group>,
  canChangeGrade: boolean,
  changeGrade: (ID, string) => Promise<*>
};

type EventsProps = {
  events: Array<Event>,
  noEventsMessage: string,
  loggedIn: boolean
};

const GroupPill = ({ group }: { group: Group }) =>
  group.showBadge ? (
    <Pill key={group.id} style={{ margin: '5px' }}>
      {group.name}
    </Pill>
  ) : null;

const BadgeTooltip = ({
  group,
  role,
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

const GroupBadge = ({ memberships }: { memberships: Array<Object> }) => {
  const activeMemberships = memberships.find(membership => membership.isActive);
  const abakusGroup = memberships[0].abakusGroup;
  if (!abakusGroup.showBadge) return null;
  // $FlowFixMe
  const sortedMemberships = orderBy(memberships, membership =>
    moment(membership.startDate || membership.createdAt)
  );
  const firstMembership = sortedMemberships[0];
  const lastMembership = sortedMemberships[sortedMemberships.length - 1];
  const { id, name, logo } = abakusGroup;
  const groupElement = (
    <Tooltip
      key={id}
      content={
        <BadgeTooltip
          group={abakusGroup}
          start={firstMembership.startDate || firstMembership.createdAt}
          end={lastMembership.endDate}
        />
      }
    >
      <CircularPicture
        alt={name}
        src={logo}
        size={50}
        style={{
          margin: '10px 5px',
          ...(!activeMemberships
            ? { filter: 'grayscale(100%)', opacity: '0.7' }
            : {})
        }}
      />
    </Tooltip>
  );
  const link = resolveGroupLink(abakusGroup);
  if (!link) {
    return groupElement;
  }
  return (
    <Link key={id} to={link}>
      {groupElement}
    </Link>
  );
};

const ListEvents = ({ events, noEventsMessage, loggedIn }: EventsProps) => (
  <div>
    {events && events.length ? (
      <Flex column wrap>
        {events.map((event, i) => (
          <EventItem
            key={i}
            event={event}
            showTags={false}
            loggedIn={loggedIn}
          />
        ))}
      </Flex>
    ) : (
      <EmptyState>
        <h2 className={styles.emptyState}>{noEventsMessage}</h2>
      </EmptyState>
    )}
  </div>
);

export default class UserProfile extends Component<Props, EventsProps> {
  sumPenalties() {
    return sumBy(this.props.penalties, 'weight');
  }

  renderFields() {
    const { user } = this.props;
    const fields = Object.keys(fieldTranslations).filter(field => user[field]);
    const tags = fields.map(field => (
      <li key={field}>
        {fieldRenders[field](fieldTranslations[field], user[field])}
      </li>
    ));

    return <ul>{tags}</ul>;
  }

  render() {
    const {
      user,
      isMe,
      loggedIn,
      showSettings,
      feedItems,
      feed,
      loading,
      previousEvents,
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
    const FRAMEID = [6050, 5962];

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
    // $FlowFixMe
    const groupedMemberships = orderBy(
      groupBy(
        pastMembershipsAsBadges.concat(membershipsAsBadges),
        'abakusGroup.id'
      ),
      memberships => !memberships.some(membership => membership.isActive)
    );

    return (
      <div className={styles.root}>
        <Helmet title={`${firstName} ${lastName}`} />

        <Flex wrap className={styles.header}>
          <div className={cx(styles.sidebar, styles.picture)}>
            {FRAMEID.includes(user.id) && (
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
              {Object.keys(groupedMemberships).map(groupId => (
                <GroupBadge
                  memberships={groupedMemberships[groupId]}
                  key={groupId}
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
            <h3>Nylig Aktivitet</h3>
            {feed ? (
              <Feed items={feedItems} feed={feed} />
            ) : (
              <LoadingIndicator loading />
            )}
            {isMe && (
              <div className={styles.bottomMargin}>
                <h3>Dine kommende arrangementer</h3>

                {loading ? (
                  <LoadingIndicator margin={'20px auto'} loading />
                ) : (
                  <ListEvents
                    events={upcomingEvents.filter(e => e.userReg.pool !== null)}
                    noEventsMessage="Du har ingen kommende arrangementer"
                    loggedIn={loggedIn}
                  />
                )}
                <h3>Arrangementer der du er på ventelista</h3>

                {loading ? (
                  <LoadingIndicator margin={'20px auto'} loading />
                ) : (
                  <ListEvents
                    events={upcomingEvents.filter(e => e.userReg.pool === null)}
                    noEventsMessage="Du har ingen kommende arrangementer"
                    loggedIn={loggedIn}
                  />
                )}
                <h3>
                  Dine tidligere arrangementer (
                  {previousEvents === undefined ? 0 : previousEvents.length})
                </h3>
                {loading ? (
                  <LoadingIndicator margin={'20px auto'} loading />
                ) : (
                  <ListEvents
                    events={
                      previousEvents === undefined
                        ? []
                        : orderBy(
                            previousEvents
                              .filter(e => e.userReg.pool !== null)
                              .filter(
                                e => e.userReg.presence !== 'NOT_PRESENT'
                              ),
                            'startTime'
                          ).reverse()
                    }
                    noEventsMessage="Du har ingen tidligere arrangementer"
                    loggedIn={loggedIn}
                  />
                )}
              </div>
            )}
          </div>
        </Flex>
      </div>
    );
  }
}
