// @flow

import styles from './Administrate.css';
import React from 'react';
import { Link } from 'react-router';
import { FlexRow } from 'app/components/FlexBox';
import Tooltip from 'app/components/Tooltip';
import Time from 'app/components/Time';
import cx from 'classnames';
import LoadingIndicator from 'app/components/LoadingIndicator';
import type {
  EventRegistration,
  EventRegistrationPresence,
  EventRegistrationChargeStatus,
  ID
} from 'app/models';

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

export const RegisteredElement = ({
  registration,
  handlePresence,
  handlePayment,
  handleUnregister,
  clickedUnregister,
  showUnregister
}: Props) => {
  const transparency = (variable, value) =>
    variable !== value && styles.transparent;

  return (
    <li className={styles.registeredList}>
      <div className={styles.one}>
        <Tooltip content={registration.user.fullName}>
          <Link to={`/users/${registration.user.username}`}>
            {registration.user.username}
          </Link>
        </Tooltip>
      </div>
      <div className={styles.center}>
        <Tooltip
          className={styles.cell}
          content={registration.pool ? 'Påmeldt' : 'Venteliste'}
        >
          {registration.pool ? (
            <i className={cx('fa fa-check-circle', styles.greenIcon)} />
          ) : (
            <i className={cx('fa fa-clock-o fa-2x', styles.greenIcon)} />
          )}
        </Tooltip>
      </div>
      <div className={styles.center}>
        <FlexRow className={styles.presenceIcons}>
          <Tooltip className={styles.cell} content="Til stede">
            <a
              className={transparency(registration.presence, 'PRESENT')}
              onClick={() => handlePresence(registration.id, 'PRESENT')}
            >
              <i className={cx('fa fa-check', styles.greenIcon)} />
            </a>
          </Tooltip>
          <Tooltip className={styles.cell} content="Ukjent">
            <a
              className={transparency(registration.presence, 'UNKNOWN')}
              onClick={() => handlePresence(registration.id, 'UNKNOWN')}
            >
              <i className={cx('fa fa-question-circle', styles.questionIcon)} />
            </a>
          </Tooltip>
          <Tooltip className={styles.cell} content="Ikke til stede">
            <a
              className={transparency(registration.presence, 'NOT_PRESENT')}
              onClick={() => handlePresence(registration.id, 'NOT_PRESENT')}
            >
              <i className={cx('fa fa-times', styles.crossIcon)} />
            </a>
          </Tooltip>
        </FlexRow>
      </div>
      <div className={styles.one}>
        <Tooltip
          content={
            <Time
              time={registration.registrationDate}
              format="DD.MM.YYYY HH:mm:ss"
            />
          }
        >
          <Time time={registration.registrationDate} format="DD.MM.YYYY" />
        </Tooltip>
      </div>
      <div className={styles.center}>
        {registration.user.grade ? registration.user.grade.name : ''}
      </div>
      <div className={styles.center}>
        <FlexRow className={styles.presenceIcons}>
          <Tooltip className={styles.cell} content="Betalt stripe">
            <div
              className={transparency(registration.chargeStatus, 'succeeded')}
            >
              <i className={cx('fa fa-cc-stripe', styles.greenIcon)} />
            </div>
          </Tooltip>
          <Tooltip className={styles.cell} content="Betalt manuelt">
            <a
              className={transparency(registration.chargeStatus, 'manual')}
              onClick={() => handlePayment(registration.id, 'manual')}
            >
              <i className={cx('fa fa-money', styles.greenIcon)} />
            </a>
          </Tooltip>
          <Tooltip className={styles.cell} content="Ikke betalt">
            <a
              className={transparency(
                !['manual', 'succeeded'].includes(registration.chargeStatus),
                true
              )}
              onClick={() => handlePayment(registration.id, 'failed')}
            >
              <i className={cx('fa fa-times', styles.crossIcon)} />
            </a>
          </Tooltip>
        </FlexRow>
      </div>
      <div className={styles.one}>
        {registration.feedback || '-'}
        <br />
        {`Allergier: ${registration.user.allergies || '-'}`}
      </div>
      <div className={styles.one}>
        {showUnregister &&
          (registration.fetching ? (
            <LoadingIndicator loading={true} small />
          ) : (
            <a onClick={() => handleUnregister(registration.id)}>
              <i
                className="fa fa-minus-circle"
                style={{ color: '#C24538', marginRight: '5px' }}
              />
              {clickedUnregister === registration.id
                ? 'Er du sikker?'
                : 'Meld av'}
            </a>
          ))}
      </div>
    </li>
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
