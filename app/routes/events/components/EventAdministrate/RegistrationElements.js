// @flow

import styles from './Administrate.css';
import React from 'react';
import { Link } from 'react-router';
import { Flex } from 'app/components/Layout';
import Tooltip from 'app/components/Tooltip';
import Time from 'app/components/Time';
import cx from 'classnames';
import type {
  EventRegistration,
  EventRegistrationPresence,
  EventRegistrationChargeStatus,
  ID
} from 'app/models';
import LoadingIndicator from 'app/components/LoadingIndicator';
import Table from 'app/components/Table';

type Props = {
  registration: EventRegistration,
  handlePresence: (
    registrationId: ID,
    presence: EventRegistrationPresence
  ) => void,
  handlePayment: (
    registrationId: ID,
    chargeStatus: EventRegistrationChargeStatus
  ) => void,
  handleUnregister: (registrationId: ID) => void,
  clickedUnregister: ID,
  showUnregister: boolean
};

const transparency = (variable, value) =>
  variable !== value && styles.transparent;

const TooltipIcon = ({ onClick, content, transparent, iconClass }) => (
  <Tooltip className={styles.cell} content={content}>
    <a className={transparent} onClick={onClick}>
      <i className={iconClass} />
    </a>
  </Tooltip>
);

const PresenceIcons = ({ handlePresence, presence, id }) => (
  <Flex row className={styles.presenceIcons}>
    <TooltipIcon
      content="Til stede"
      iconClass={cx('fa fa-check', styles.greenIcon)}
      transparent={transparency(presence, 'PRESENT')}
      onClick={() => handlePresence(id, 'PRESENT')}
    />
    <TooltipIcon
      content="Ukjent"
      iconClass={cx('fa fa-question-circle', styles.questionIcon)}
      transparent={transparency(presence, 'UNKNOWN')}
      onClick={() => handlePresence(id, 'UNKNOWN')}
    />
    <TooltipIcon
      content="Ikke til stede"
      iconClass={cx('fa fa-times', styles.crossIcon)}
      transparent={transparency(presence, 'NOT_PRESENT')}
      onClick={() => handlePresence(id, 'NOT_PRESENT')}
    />
  </Flex>
);

const StripeStatus = ({ id, handlePayment, chargeStatus, ...props }) => (
  <Flex row className={styles.presenceIcons}>
    <TooltipIcon
      content="Betalt stripe"
      iconClass={cx('fa fa-cc-stripe', styles.greenIcon)}
      transparent={transparency(chargeStatus, 'succeeded')}
      onClick={() => handlePayment(id, 'succeeded')}
    />
    <TooltipIcon
      content="Betalt manuelt"
      chargeType="manual"
      transparent={transparency(chargeStatus, 'manual')}
      iconClass={cx('fa fa-money', styles.greenIcon)}
    />
    <TooltipIcon
      content="Ikke betalt"
      chargeType="failed"
      transparent={transparency(
        !['manual', 'succeeded'].includes(chargeStatus),
        true
      )}
      iconClass={cx('fa fa-times', styles.crossIcon)}
    />
  </Flex>
);

const Unregister = ({
  fetching,
  handleUnregister,
  id,
  clickedUnregister,
  showUnregister
}) => {
  console.log('fetching', fetching);
  return (
    <div>
      {showUnregister &&
        (fetching ? (
          <LoadingIndicator loading={true} small />
        ) : (
          <a onClick={() => handleUnregister(id)}>
            <i
              className="fa fa-minus-circle"
              style={{ color: '#C24538', marginRight: '5px' }}
            />
            {clickedUnregister === id ? 'Er du sikker?' : 'Meld av'}
          </a>
        ))}
    </div>
  );
};

export const RegisteredTable = ({
  registered,
  loading,
  handlePresence,
  handlePayment,
  handleUnregister,
  clickedUnregister,
  showUnregister
}: Props) => {
  console.log('registered', registered);
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
      dataIndex: 'pool',
      render: pool => (
        <TooltipIcon
          content={pool ? 'Påmeldt' : 'Venteliste'}
          iconClass={
            pool
              ? cx('fa fa-check-circle', styles.greenIcon)
              : cx('fa fa-clock-o fa-2x', styles.greenIcon)
          }
        />
      )
    },
    {
      title: 'Til stede',
      dataIndex: 'id',
      render: (id, registration) => (
        <PresenceIcons
          id={id}
          presence={registration.presence}
          handlePresence={handlePresence}
        />
      )
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
      title: 'Klassetrinn',
      dataIndex: 'user',
      render: user => <span>{user.grade ? user.grade.name : ''}</span>
    },
    {
      title: 'Betaling',
      dataIndex: 'id',
      render: (id, registration) => (
        <StripeStatus
          id={id}
          chargeStatus={registration.chargeStatus}
          handlePayment={handlePayment}
        />
      )
    },
    {
      title: 'Tilbakemelding',
      dataIndex: 'id',
      render: (id, registration) => (
        <span>
          {registration.feedback || '-'}
          <br />
          {`Allergier: ${registration.user.allergies || '-'}`}
        </span>
      )
    },
    {
      title: 'Administrer',
      dataIndex: 'id',
      render: (id, registration) => {
        console.log('unreg', id, registration);
        return (
          <Unregister
            fetching={registration.fetching}
            handleUnregister={handleUnregister}
            id={id}
            clickedUnregister={clickedUnregister}
            showUnregister={showUnregister}
          />
        );
      }
    }
  ];
  return (
    <Table
      infiniteScroll
      columns={columns}
      loading={loading}
      data={registered}
    />
  );
};

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
