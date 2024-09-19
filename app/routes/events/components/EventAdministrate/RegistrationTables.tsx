import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Table from 'app/components/Table';
import Time from 'app/components/Time';
import Tooltip from 'app/components/Tooltip';
import {
  getEventSemesterFromStartTime,
  allConsentsAnswered,
  getConsent,
} from 'app/routes/events/utils';
import { PhotoConsentDomain } from 'app/store/models/User';
import { isNotNullish } from 'app/utils';
import { WEBKOM_GROUP_ID } from 'app/utils/constants';
import styles from './Administrate.css';
import {
  StripeStatus,
  TooltipIcon,
  PresenceIcons,
  Unregister,
} from './AttendeeElements';
import type { ColumnProps } from 'app/components/Table';
import type { EventSemester } from 'app/models';
import type {
  PoolWithRegistrations,
  SelectedAdminRegistration,
} from 'app/reducers/events';
import type { AdministrateEvent } from 'app/store/models/Event';
import type { PhotoConsent } from 'app/store/models/User';

type Props = {
  registered: SelectedAdminRegistration[];
  loading: boolean;
  showPresence: boolean;
  showUnregister: boolean;
  event: AdministrateEvent;
  pools: PoolWithRegistrations[];
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
      : 'fa fa-share-square',
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
      photoConsents,
    );
    const soMeConsent = getConsent(
      SOCIAL_MEDIA,
      eventSemester.year,
      eventSemester.semester,
      photoConsents,
    );
    return (
      <Flex alignItems="center" justifyContent="center">
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

export const RegisteredTable = ({
  registered,
  loading,
  showPresence,
  showUnregister,
  event,
  pools,
}: Props) => {
  type Registration = (typeof registered)[number];

  const gradeColumn = {
    title: 'Klassetrinn',
    dataIndex: 'user.grade',
    render: GradeRenderer,
    sorter: (a: Registration, b: Registration) => {
      if (a.user.grade && b.user.grade) {
        if (a.user.grade.name === b.user.grade.name) return 0;
        if (a.user.grade.name > b.user.grade.name) return 1;
      }
      if (!a.user.grade && b.user.grade) return 1;
      else return -1;
    },
  } satisfies ColumnProps<Registration>;

  const hasNonEmptyFeedback = pools.some((pool) =>
    pool.registrations.some(
      (registration) => registration.feedback?.trim() !== '',
    ),
  );
  const showFeedback =
    event.feedbackRequired ||
    (event.feedbackDescription && event.feedbackDescription !== '') ||
    hasNonEmptyFeedback;

  const columns: ColumnProps<Registration>[] = [
    {
      title: '#',
      dataIndex: 'nr',
      render: (_, registration: Registration) => (
        <span>{registered.indexOf(registration) + 1}.</span>
      ),
      sorter: (a: Registration, b: Registration) => {
        if (registered.indexOf(a) > registered.indexOf(b)) return 1;
        else return -1;
      },
    },
    {
      title: 'Bruker',
      dataIndex: 'user',
      search: true,
      centered: false,
      render: (user: Registration['user']) => (
        <Link to={`/users/${user.username}`}>{user.fullName}</Link>
      ),
      filterMapping: (user: Registration['user']) => user.fullName,
    },
    {
      title: 'Status',
      dataIndex: 'pool',
      render: (_, registration: Registration) => {
        const registrationInfo = getRegistrationInfo(registration);
        return (
          <RegistrationPill
            status={registrationInfo.status}
            reason={registrationInfo.reason}
            className={registrationInfo.className}
          />
        );
      },
      sorter: (a: Registration, b: Registration) => {
        if (a.pool && !b.pool) return -1;
        if (!a.pool && b.pool) return 1;
        return 0;
      },
    },
    {
      title: 'Oppmøte',
      dataIndex: 'presence',
      visible: showPresence,
      render: (
        presence: Registration['presence'],
        registration: Registration,
      ) => {
        return (
          <PresenceIcons registrationId={registration.id} presence={presence} />
        );
      },
    },
    {
      title: 'Dato',
      dataIndex: 'registrationDate',
      render: (date: Registration['registrationDate']) => (
        <Tooltip content={<Time time={date} format="DD.MM.YYYY HH:mm:ss" />}>
          <Time time={date} format="DD.MM.YYYY" />
        </Tooltip>
      ),
    },
    {
      title: 'Samtykke',
      dataIndex: 'photoConsents',
      visible: event.useConsent,
      render: (_, registration: Registration) => {
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
              render: (pool: Registration['pool']) => {
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
      visible: event.isPriced,
      render: (
        paymentStatus: Registration['paymentStatus'],
        registration: Registration,
      ) => (
        <StripeStatus
          registrationId={registration.id}
          paymentStatus={paymentStatus ?? null}
        />
      ),
      sorter: (a: Registration, b: Registration) => {
        const paymentStatusA = a.paymentStatus ?? 'failed';
        const paymentStatusB = b.paymentStatus ?? 'failed';
        return paymentStatusA > paymentStatusB ? 1 : -1;
      },
    },
    showFeedback
      ? {
          title: 'Tilbakemelding',
          dataIndex: 'feedback',
          centered: false,
          render: (feedback: Registration['feedback']) => (
            <span>{feedback || ''}</span>
          ),
          sorter: (a: Registration, b: Registration) =>
            a.feedback.localeCompare(b.feedback),
        }
      : undefined,
    {
      dataIndex: 'unregistering',
      visible: showUnregister,
      render: (
        fetching: Registration['unregistering'],
        registration: Registration,
      ) => <Unregister fetching={!!fetching} registration={registration} />,
    },
  ].filter(isNotNullish);

  return (
    <Table
      hasMore={false}
      columns={columns}
      loading={loading}
      data={registered}
    />
  );
};

type UnregisteredTableProps = {
  loading: boolean;
  unregistered: SelectedAdminRegistration[];
  event: AdministrateEvent;
};
export const UnregisteredTable = ({
  loading,
  unregistered,
  event,
}: UnregisteredTableProps) => {
  type Registration = (typeof unregistered)[number];

  const columns = [
    {
      title: 'Bruker',
      dataIndex: 'user',
      filterMessage: 'Filtrer på navn',
      render: (user: Registration['user']) => (
        <Tooltip content={user.fullName}>
          <Link to={`/users/${user.username}`}>{user.username}</Link>
        </Tooltip>
      ),
    },
    {
      title: 'Påmeldt',
      dataIndex: 'registrationDate',
      render: (registrationDate: Registration['registrationDate']) => (
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
      render: (unregistrationDate: Registration['unregistrationDate']) => (
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
      visible: event.isPriced,
      render: (
        paymentStatus: Registration['paymentStatus'],
        registration: Registration,
      ) => (
        <StripeStatus
          registrationId={registration.id}
          paymentStatus={paymentStatus ?? null}
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
};
