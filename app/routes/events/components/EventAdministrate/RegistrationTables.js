// @flow

import styles from './Administrate.css';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Tooltip from 'app/components/Tooltip';
import Time from 'app/components/Time';
import cx from 'classnames';
import { WEBKOM_GROUP_ID } from 'app/utils/constants';
import type {
  EventRegistration,
  EventRegistrationPresence,
  EventRegistrationChargeStatus,
  ID,
  Event
} from 'app/models';
import Table from 'app/components/Table';
import {
  StripeStatus,
  TooltipIcon,
  PresenceIcons,
  Unregister
} from './AttendeeElements';

type Props = {
  registered: Array<EventRegistration>,
  loading: boolean,
  handlePresence: (
    registrationId: ID,
    presence: EventRegistrationPresence
  ) => Promise<*>,
  handlePayment: (
    registrationId: ID,
    chargeStatus: EventRegistrationChargeStatus
  ) => Promise<*>,
  handleUnregister: (registrationId: ID) => void,
  clickedUnregister: ID,
  showUnregister: boolean,
  event: Event
};
const GradeRenderer = (group: { name: string }) =>
  !!group && (
    <Tooltip content={group.name}>
      <span>
        {group.name
          .replace('Kommunikasjonsteknologi', 'Komtek')
          .replace('Datateknologi', 'Data')}
      </span>
    </Tooltip>
  );

const hasWebkomGroup = user => user.abakusGroups.includes(WEBKOM_GROUP_ID);

const getRegistrationInfo = (pool, registration) => {
  let registrationInfo = {
    reason: 'Venteliste',
    icon: cx('fa fa-clock-o fa-2x', styles.orangeIcon)
  };
  if (registration.adminRegistrationReason !== '') {
    registrationInfo.icon = cx('fa fa-user-secret', styles.greenIcon);
    if (registration.createdBy !== null) {
      if (
        hasWebkomGroup(registration.user) &&
        hasWebkomGroup(registration.createdBy)
      ) {
        registrationInfo.icon = cx('fa fa-power-off', styles.webkomIcon);
        registrationInfo.reason = `Webkompåmeldt av ${
          registration.createdBy.username
        }: ${registration.adminRegistrationReason}`;
      } else {
        registrationInfo.reason = `Adminpåmeldt av ${
          registration.createdBy.username
        }: ${registration.adminRegistrationReason}`;
      }
    } else {
      registrationInfo.reason = `Adminpåmeldt: ${
        registration.adminRegistrationReason
      }`;
    }
  } else if (pool) {
    registrationInfo.reason = 'Påmeldt';
    registrationInfo.icon = cx('fa fa-check-circle', styles.greenIcon);
  }
  return registrationInfo;
};

export class RegisteredTable extends Component<Props> {
  render() {
    const {
      registered,
      loading,
      handlePresence,
      handlePayment,
      handleUnregister,
      clickedUnregister,
      showUnregister,
      event
    } = this.props;
    const columns = [
      {
        title: 'Bruker',
        dataIndex: 'user',
        render: user => (
          <Link to={`/users/${user.username}`}>{user.fullName}</Link>
        )
      },
      {
        title: 'Status',
        center: true,
        dataIndex: 'pool',
        render: (pool, registration) => {
          const registrationInfo = getRegistrationInfo(pool, registration);
          return (
            <TooltipIcon
              content={registrationInfo.reason}
              iconClass={registrationInfo.icon}
            />
          );
        }
      },
      {
        title: 'Til stede',
        dataIndex: 'presence',
        render: (presence, registration) => {
          return (
            <PresenceIcons
              id={registration.id}
              presence={presence}
              handlePresence={handlePresence}
            />
          );
        }
      },
      {
        title: 'Dato',
        dataIndex: 'registrationDate',
        render: date => (
          <Tooltip content={<Time time={date} format="DD.MM.YYYY HH:mm:ss" />}>
            <Time time={date} format="DD.MM.YYYY" />
          </Tooltip>
        )
      },
      {
        title: 'Samtykke',
        dataIndex: 'photoConsent',
        visible: !!event.useConsent,
        center: true,
        render: consent =>
          consent !== 'UNKNOWN' && (
            <TooltipIcon
              content={consent}
              iconClass={
                consent === 'PHOTO_CONSENT'
                  ? cx('fa fa-check', styles.greenIcon)
                  : cx('fa fa-times', styles.crossIcon)
              }
            />
          )
      },
      {
        title: 'Klassetrinn',
        dataIndex: 'user.grade',
        render: GradeRenderer
      },
      {
        title: 'Betaling',
        dataIndex: 'chargeStatus',
        visible: event.isPriced,
        center: true,
        render: (chargeStatus, registration) => (
          <StripeStatus
            id={registration.id}
            chargeStatus={chargeStatus}
            handlePayment={handlePayment}
          />
        )
      },
      {
        title: 'Tilbakemelding',
        dataIndex: 'feedback',
        render: (feedback, registration) => (
          <span>
            {feedback || '-'}
            <br />
            {`Allergier: ${registration.user.allergies || '-'}`}
          </span>
        )
      },
      {
        title: 'Administrer',
        dataIndex: 'fetching',
        visible: showUnregister,
        render: (fetching, registration) => (
          <Unregister
            fetching={fetching}
            handleUnregister={handleUnregister}
            id={registration.id}
            clickedUnregister={clickedUnregister}
          />
        )
      }
    ];
    return (
      <Table
        infiniteScroll
        hasMore={false}
        columns={columns}
        loading={loading}
        data={registered}
      />
    );
  }
}

type UnregisteredElementProps = {
  registration: EventRegistration
};

export const UnregisteredElement = ({
  registration
}: UnregisteredElementProps) => {
  return (
    <li className={styles.unregisteredList}>
      <div className={styles.col}>
        <Tooltip content={registration.user.fullName}>
          <Link to={`/users/${registration.user.username}`}>
            {registration.user.username}
          </Link>
        </Tooltip>
      </div>
      <div className={styles.col}>Avmeldt</div>
      <div className={styles.col}>
        <Tooltip
          content={
            <Time
              time={registration.registrationDate}
              format="DD.MM.YYYY HH:mm"
            />
          }
        >
          <Time time={registration.registrationDate} format="DD.MM.YYYY" />
        </Tooltip>
      </div>
      <div className={styles.col}>
        <Tooltip
          content={
            <Time
              time={registration.unregistrationDate}
              format="DD.MM.YYYY HH:mm"
            />
          }
        >
          <Time time={registration.unregistrationDate} format="DD.MM.YYYY" />
        </Tooltip>
      </div>
      <div className={styles.col}>
        {registration.user.grade ? registration.user.grade.name : ''}
      </div>
    </li>
  );
};

type UnregisteredTableProps = {
  loading: boolean,
  unregistered: Array<EventRegistration>
};

export class UnregisteredTable extends Component<UnregisteredTableProps> {
  render() {
    const { loading, unregistered } = this.props;
    const columns = [
      {
        title: 'Bruker',
        dataIndex: 'user',
        render: user => (
          <Tooltip content={user.fullName}>
            <Link to={`/users/${user.username}`}>{user.username}</Link>
          </Tooltip>
        )
      },
      {
        title: 'Status',
        dataIndex: 'user',
        render: () => <span>Avmeldt</span>
      },
      {
        title: 'Påmeldt',
        dataIndex: 'registrationDate',
        render: registrationDate => (
          <Tooltip
            content={<Time time={registrationDate} format="DD.MM.YYYY HH:mm" />}
          >
            <Time time={registrationDate} format="DD.MM.YYYY" />
          </Tooltip>
        )
      },
      {
        title: 'Avmeldt',
        dataIndex: 'unregistrationDate',
        render: unregistrationDate => (
          <Tooltip
            content={
              <Time time={unregistrationDate} format="DD.MM.YYYY HH:mm:ss" />
            }
          >
            <Time time={unregistrationDate} format="DD.MM.YYYY" />
          </Tooltip>
        )
      },
      {
        title: 'Klassetrinn',
        dataIndex: 'user.grade',
        render: GradeRenderer
      }
    ];
    return (
      <Table
        infiniteScroll
        hasMore={false}
        columns={columns}
        loading={loading}
        data={unregistered}
      />
    );
  }
}
