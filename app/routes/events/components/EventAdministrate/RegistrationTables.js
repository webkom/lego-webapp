// @flow

import styles from './Administrate.css';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import Tooltip from 'app/components/Tooltip';
import Time from 'app/components/Time';
import cx from 'classnames';
import { WEBKOM_GROUP_ID } from 'app/utils/constants';
import type {
  EventRegistration,
  EventRegistrationPresence,
  EventRegistrationPaymentStatus,
  ID,
  Event,
} from 'app/models';
import Table from 'app/components/Table';
import {
  StripeStatus,
  TooltipIcon,
  PresenceIcons,
  Unregister,
} from './AttendeeElements';
import { getEventSemesterFromStartTime } from '../../utils';

type Props = {
  registered: Array<EventRegistration>,
  loading: boolean,
  handlePresence: (
    registrationId: ID,
    presence: EventRegistrationPresence
  ) => Promise<*>,
  handlePayment: (
    registrationId: ID,
    paymentStatus: EventRegistrationPaymentStatus
  ) => Promise<*>,
  handleUnregister: (registrationId: ID) => void,
  clickedUnregister: ID,
  showUnregister: boolean,
  event: Event,
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

const hasWebkomGroup = (user) => user.abakusGroups.includes(WEBKOM_GROUP_ID);

const getRegistrationInfo = (pool, registration) => {
  let registrationInfo = {
    reason: 'Venteliste',
    icon: cx('fa fa-clock-o fa-2x', styles.orangeIcon),
  };
  if (registration.adminRegistrationReason !== '') {
    registrationInfo.icon = cx('fa fa-user-secret', styles.greenIcon);
    if (registration.createdBy !== null) {
      if (
        hasWebkomGroup(registration.user) &&
        hasWebkomGroup(registration.createdBy)
      ) {
        registrationInfo.icon = cx('fa fa-power-off', styles.webkomIcon);
        registrationInfo.reason = `Webkompåmeldt av ${registration.createdBy.username}: ${registration.adminRegistrationReason}`;
      } else {
        registrationInfo.reason = `Adminpåmeldt av ${registration.createdBy.username}: ${registration.adminRegistrationReason}`;
      }
    } else {
      registrationInfo.reason = `Adminpåmeldt: ${registration.adminRegistrationReason}`;
    }
  } else if (pool) {
    registrationInfo.reason = 'Påmeldt';
    registrationInfo.icon = cx('fa fa-check-circle', styles.greenIcon);
  }
  return registrationInfo;
};

const getConsentIcons = (
  LEGACY_photoConsent,
  isConsentingWeb,
  isConsentingSoMe
) => {
  if (
    typeof isConsentingWeb === 'boolean' &&
    typeof isConsentingSoMe === 'boolean'
  ) {
    return (
      <>
        <TooltipIcon
          content={
            (isConsentingWeb === true
              ? 'Brukeren godkjenner '
              : 'Brukeren godkjenner IKKE ') +
            'at bilder publiseres på Abakus.no'
          }
          iconClass={
            isConsentingWeb === true
              ? cx('fa fa-circle', styles.greenIcon)
              : cx('fa fa-circle', styles.crossIcon)
          }
        />
        <TooltipIcon
          content={
            (isConsentingSoMe === true
              ? 'Brukeren godkjenner '
              : 'Brukeren godkjenner IKKE ') +
            'at bilder publiseres på sosiale medier'
          }
          iconClass={
            isConsentingSoMe === true
              ? cx('fa fa-facebook-square', styles.greenIcon)
              : cx('fa fa-facebook-square', styles.crossIcon)
          }
        />
      </>
    );
  }

  return (
    <TooltipIcon
      content={LEGACY_photoConsent}
      iconClass={
        LEGACY_photoConsent === 'PHOTO_CONSENT'
          ? cx('fa fa-check', styles.greenIcon)
          : cx('fa fa-times', styles.crossIcon)
      }
    />
  );
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
      event,
    } = this.props;
    const columns = [
      {
        title: 'Bruker',
        dataIndex: 'user',
        render: (user) => (
          <Link to={`/users/${user.username}`}>{user.fullName}</Link>
        ),
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
        },
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
        },
      },
      {
        title: 'Dato',
        dataIndex: 'registrationDate',
        render: (date) => (
          <Tooltip content={<Time time={date} format="DD.MM.YYYY HH:mm:ss" />}>
            <Time time={date} format="DD.MM.YYYY" />
          </Tooltip>
        ),
      },
      {
        title: 'Samtykke',
        dataIndex: 'photoConsents',
        visible: !!event.useConsent,
        center: true,
        render: (feedback, registration) => {
          const eventSemester = getEventSemesterFromStartTime(event.startTime);
          const photoConsents = registration.user.photoConsents;

          const LEGACY_photoConsent = registration.LEGACYPhotoConsent;

          const isConsentingWeb = photoConsents.find(
            (consent) =>
              consent.domain === 'WEBSITE' && consent.semester === eventSemester
          )?.isConsenting;

          const isConsentingSoMe = photoConsents.find(
            (consent) =>
              consent.domain === 'SOCIAL_MEDIA' &&
              consent.semester === eventSemester
          )?.isConsenting;

          return (
            <div className={styles.consents}>
              {getConsentIcons(
                LEGACY_photoConsent,
                isConsentingWeb,
                isConsentingSoMe
              )}
            </div>
          );
        },
      },
      {
        title: 'Klassetrinn',
        dataIndex: 'user.grade',
        render: GradeRenderer,
      },
      {
        title: 'Betaling',
        dataIndex: 'paymentStatus',
        visible: event.isPriced,
        center: true,
        render: (paymentStatus, registration) => (
          <StripeStatus
            id={registration.id}
            paymentStatus={paymentStatus}
            handlePayment={handlePayment}
          />
        ),
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
        ),
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
        ),
      },
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
  registration: EventRegistration,
};

export const UnregisteredElement = ({
  registration,
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
  unregistered: Array<EventRegistration>,
};

export class UnregisteredTable extends Component<UnregisteredTableProps> {
  render() {
    const { loading, unregistered } = this.props;
    const columns = [
      {
        title: 'Bruker',
        dataIndex: 'user',
        render: (user) => (
          <Tooltip content={user.fullName}>
            <Link to={`/users/${user.username}`}>{user.username}</Link>
          </Tooltip>
        ),
      },
      {
        title: 'Status',
        dataIndex: 'user',
        render: () => <span>Avmeldt</span>,
      },
      {
        title: 'Påmeldt',
        dataIndex: 'registrationDate',
        render: (registrationDate) => (
          <Tooltip
            content={<Time time={registrationDate} format="DD.MM.YYYY HH:mm" />}
          >
            <Time time={registrationDate} format="DD.MM.YYYY" />
          </Tooltip>
        ),
      },
      {
        title: 'Avmeldt',
        dataIndex: 'unregistrationDate',
        render: (unregistrationDate) => (
          <Tooltip
            content={
              <Time time={unregistrationDate} format="DD.MM.YYYY HH:mm:ss" />
            }
          >
            <Time time={unregistrationDate} format="DD.MM.YYYY" />
          </Tooltip>
        ),
      },
      {
        title: 'Klassetrinn',
        dataIndex: 'user.grade',
        render: GradeRenderer,
      },
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
