import cx from 'classnames';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import Flex from 'app/components/Layout/Flex';
import Table from 'app/components/Table';
import Time from 'app/components/Time';
import Tooltip from 'app/components/Tooltip';
import type {
  EventRegistration,
  EventRegistrationPresence,
  EventRegistrationPaymentStatus,
  ID,
  EventAdministrate,
  EventPool,
  PhotoConsent,
  EventSemester,
} from 'app/models';
import { PhotoConsentDomain } from 'app/models';
import {
  getEventSemesterFromStartTime,
  allConsentsAnswered,
  getConsent,
} from 'app/routes/events/utils';
import { WEBKOM_GROUP_ID } from 'app/utils/constants';
import styles from './Administrate.module.css';
import {
  StripeStatus,
  TooltipIcon,
  PresenceIcons,
  Unregister,
} from './AttendeeElements';

type Props = {
  registered: Array<EventRegistration>;
  loading: boolean;
  handlePresence: (
    registrationId: ID,
    presence: EventRegistrationPresence
  ) => Promise<any>;
  handlePayment: (
    registrationId: ID,
    paymentStatus: EventRegistrationPaymentStatus
  ) => Promise<any>;
  handleUnregister: (registrationId: ID) => Promise<void>;
  showPresence: boolean;
  showUnregister: boolean;
  event: EventAdministrate;
  pools: Array<EventPool>;
};

const GradeRenderer = (group: { name: string }) =>
  !!group && (
    <Tooltip content={group.name}>
      <span>
        {group.name
          .replace('klasse Kommunikasjonsteknologi', 'komtek')
          .replace('klasse Datateknologi', 'data')}
      </span>
    </Tooltip>
  );

const hasWebkomGroup = (user) => user.abakusGroups?.includes(WEBKOM_GROUP_ID);

const getPoolName = (pools, poolId) => {
  const pool = pools.find((pool) => pool.id === poolId);
  return pool && pool.name;
};

type RegistrationPillProps = {
  status: string;
  reason: string;
  className: string;
};

export const RegistrationPill = ({
  status,
  reason,
  className,
}: RegistrationPillProps) => {
  if (reason.length === 0)
    return (
      <div className={cx(styles.pill, className)}>
        <span>{status}</span>
      </div>
    );

  return (
    <Tooltip content={reason}>
      <div className={cx(styles.pill, className)}>
        <span>{status}</span>
      </div>
    </Tooltip>
  );
};

export const getRegistrationInfo = (registration) => {
  const registrationInfo = {
    status: 'Venteliste',
    reason: '',
    className: styles.orangePill,
  };

  if (registration.pool) {
    registrationInfo.status = 'Påmeldt';
    registrationInfo.className = styles.greenPill;
  }

  if (registration.adminRegistrationReason !== '') {
    registrationInfo.className = styles.bluePill;

    if (registration.createdBy !== null) {
      if (
        hasWebkomGroup(registration.user) &&
        hasWebkomGroup(registration.createdBy)
      ) {
        registrationInfo.className = styles.webkomPill;
        registrationInfo.reason = `Webkompåmeldt av ${registration.createdBy.username}: ${registration.adminRegistrationReason}`;
      } else {
        registrationInfo.reason = `Adminpåmeldt av ${registration.createdBy.username}: ${registration.adminRegistrationReason}`;
      }
    } else {
      registrationInfo.reason = `Adminpåmeldt: ${registration.adminRegistrationReason}`;
    }
  }

  return registrationInfo;
};

const consentMessage = (photoConsent) =>
  `Brukeren godkjenner ${
    photoConsent?.isConsenting ? ' ' : 'IKKE '
  } at bilder publiseres på ${
    photoConsent?.domain === PhotoConsentDomain.WEBSITE
      ? 'abakus.no'
      : 'sosiale medier'
  }`;

const iconClass = (photoConsent) =>
  cx(
    styles.consentIcon,
    photoConsent?.isConsenting ? styles.greenIcon : styles.redIcon,
    photoConsent?.domain === PhotoConsentDomain.WEBSITE
      ? 'fa fa-desktop'
      : 'fa fa-share-square'
  );

const ConsentIcons = ({
  LEGACY_photoConsent,
  photoConsents,
  eventSemester,
}: {
  LEGACY_photoConsent: string;
  photoConsents: Array<PhotoConsent>;
  eventSemester: EventSemester;
}) => {
  if (allConsentsAnswered(photoConsents)) {
    const { WEBSITE, SOCIAL_MEDIA } = PhotoConsentDomain;
    const webConsent = getConsent(
      WEBSITE,
      eventSemester.year,
      eventSemester.semester,
      photoConsents
    );
    const soMeConsent = getConsent(
      SOCIAL_MEDIA,
      eventSemester.year,
      eventSemester.semester,
      photoConsents
    );
    return (
      <Flex justifyContent="center" gap={5}>
        <TooltipIcon
          content={consentMessage(webConsent)}
          iconClass={iconClass(webConsent)}
        />
        <TooltipIcon
          content={consentMessage(soMeConsent)}
          iconClass={iconClass(soMeConsent)}
        />
      </Flex>
    );
  }

  return (
    <TooltipIcon
      content={LEGACY_photoConsent}
      iconClass={
        LEGACY_photoConsent === 'PHOTO_CONSENT'
          ? cx('fa fa-check', styles.greenIcon)
          : cx('fa fa-times', styles.redIcon)
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
      showPresence,
      showUnregister,
      event,
      pools,
    } = this.props;

    const gradeColumn = {
      title: 'Klassetrinn',
      dataIndex: 'user.grade',
      render: GradeRenderer,
      sorter: (a, b) => {
        if (a.user.grade && b.user.grade) {
          if (a.user.grade.name === b.user.grade.name) return 0;
          if (a.user.grade.name > b.user.grade.name) return 1;
        }
        if (!a.user.grade && b.user.grade) return 1;
        else return -1;
      },
    };

    const columns = [
      {
        title: '#',
        dataIndex: 'nr',
        render: (_, registration) => (
          <span>{registered.indexOf(registration) + 1}.</span>
        ),
        sorter: (a, b) => {
          if (registered.indexOf(a) > registered.indexOf(b)) return 1;
          else return -1;
        },
      },
      {
        title: 'Bruker',
        dataIndex: 'user',
        search: true,
        centered: false,
        render: (user) => (
          <Link to={`/users/${user.username}`}>{user.fullName}</Link>
        ),
        filterMapping: (user) => user.fullName,
      },
      {
        title: 'Status',
        dataIndex: 'pool',
        render: (pool, registration) => {
          const registrationInfo = getRegistrationInfo(registration);
          return (
            <RegistrationPill
              status={registrationInfo.status}
              reason={registrationInfo.reason}
              className={registrationInfo.className}
            />
          );
        },
        sorter: (a, b) => {
          if (a.pool && !b.pool) return -1;
          if (!a.pool && b.pool) return 1;
          return 0;
        },
      },
      {
        title: 'Til stede',
        dataIndex: 'presence',
        visible: showPresence,
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
        render: (feedback, registration) => {
          const eventSemester = getEventSemesterFromStartTime(event.startTime);
          const photoConsents = registration.photoConsents;
          const LEGACY_photoConsent = registration.LEGACYPhotoConsent;
          return (
            <div className={styles.consents}>
              <ConsentIcons
                LEGACY_photoConsent={LEGACY_photoConsent}
                photoConsents={photoConsents}
                eventSemester={eventSemester}
              />
            </div>
          );
        },
      },
      pools.length === 1
        ? {
            ...gradeColumn,
          }
        : {
            dataIndex: 'gradeOrPool',
            columnChoices: [
              {
                ...gradeColumn,
              },
              {
                title: 'Pool',
                dataIndex: 'pool',
                render: (pool, registration) => {
                  const poolName = getPoolName(pools, pool);
                  return <span>{poolName}</span>;
                },
                sorter: true,
              },
            ],
          },
      {
        title: 'Betaling',
        dataIndex: 'paymentStatus',
        visible: !!event.isPriced,
        render: (paymentStatus, registration) => (
          <StripeStatus
            id={registration.id}
            paymentStatus={paymentStatus}
            handlePayment={handlePayment}
          />
        ),
        sorter: (a, b) => {
          const paymentStatusA = a.paymentStatus ?? 'failed';
          const paymentStatusB = b.paymentStatus ?? 'failed';
          return paymentStatusA > paymentStatusB ? 1 : -1;
        },
      },
      {
        title: 'Tilbakemelding',
        dataIndex: 'feedback',
        centered: false,
        render: (feedback) => <span>{feedback || '-'}</span>,
        sorter: (a, b) => a.feedback.localeCompare(b.feedback),
      },
      {
        dataIndex: 'unregister',
        visible: showUnregister,
        render: (fetching, registration) => (
          <Unregister
            fetching={fetching}
            handleUnregister={handleUnregister}
            registration={registration}
          />
        ),
      },
    ];
    return (
      <Table
        hasMore={false}
        columns={columns}
        loading={loading}
        data={registered}
      />
    );
  }
}
type UnregisteredElementProps = {
  registration: EventRegistration;
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
  loading: boolean;
  unregistered: Array<EventRegistration>;
  handlePayment: (
    registrationId: ID,
    paymentStatus: EventRegistrationPaymentStatus
  ) => Promise<any>;
  event: EventAdministrate;
};
export class UnregisteredTable extends Component<UnregisteredTableProps> {
  render() {
    const { loading, unregistered, handlePayment, event } = this.props;
    const columns = [
      {
        title: 'Bruker',
        dataIndex: 'user',
        filterMessage: 'Filtrer på navn',
        render: (user) => (
          <Tooltip content={user.fullName}>
            <Link to={`/users/${user.username}`}>{user.username}</Link>
          </Tooltip>
        ),
      },
      {
        title: 'Påmeldt',
        dataIndex: 'registrationDate',
        render: (registrationDate) => (
          <Tooltip
            content={
              <Time time={registrationDate} format="DD.MM.YYYY HH:mm:ss" />
            }
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
        title: 'Betaling',
        dataIndex: 'paymentStatus',
        visible: !!event.isPriced,
        render: (paymentStatus, registration) => (
          <StripeStatus
            id={registration.id}
            paymentStatus={paymentStatus}
            handlePayment={handlePayment}
          />
        ),
      },
    ];
    return (
      <Table
        hasMore={false}
        columns={columns}
        loading={loading}
        data={unregistered}
      />
    );
  }
}
