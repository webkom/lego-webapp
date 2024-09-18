import {
  ConfirmModal,
  Flex,
  Icon,
  LoadingIndicator,
} from '@webkom/lego-bricks';
import cx from 'classnames';
import { useParams } from 'react-router-dom';
import {
  unregister,
  updatePayment,
  updatePresence,
} from 'app/actions/EventActions';
import Tooltip from 'app/components/Tooltip';
import { useAppDispatch } from 'app/store/hooks';
import { Presence } from 'app/store/models/Registration';
import styles from './Administrate.css';
import type { EntityId } from '@reduxjs/toolkit';
import type { EventRegistrationPaymentStatus } from 'app/models';
import type { SelectedAdminRegistration } from 'app/reducers/events';
import type { MouseEventHandler } from 'react';

type TooltipIconProps = {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  content: string;
  transparent?: boolean;
  iconName?: string;
  iconClass: string;
  disabled?: boolean;
};
type PresenceProps = {
  presence: Presence;
  registrationId: EntityId;
};
type UnregisterProps = {
  fetching: boolean;
  registration: SelectedAdminRegistration;
};
type StripeStatusProps = {
  registrationId: EntityId;
  paymentStatus: EventRegistrationPaymentStatus | null;
};

export const TooltipIcon = ({
  onClick,
  content,
  transparent,
  iconName,
  iconClass,
  disabled = false,
}: TooltipIconProps) => {
  const classNames = cx(iconClass, transparent && styles.transparent);

  return (
    <Tooltip content={content}>
      {iconName ? (
        <Icon
          name={iconName}
          className={classNames}
          onClick={onClick}
          disabled={disabled}
          size={22}
        />
      ) : (
        <button onClick={onClick} disabled={disabled}>
          <i className={classNames} />
        </button>
      )}
    </Tooltip>
  );
};

export const PresenceIcons = ({ presence, registrationId }: PresenceProps) => {
  const { eventId } = useParams<{ eventId: string }>();
  const dispatch = useAppDispatch();

  return (
    <Flex alignItems="center" justifyContent="center">
      <TooltipIcon
        content="Møtte opp"
        iconName="checkmark"
        iconClass={styles.greenIcon}
        transparent={presence !== 'PRESENT'}
        onClick={() =>
          eventId &&
          dispatch(updatePresence(eventId, registrationId, Presence.PRESENT))
        }
      />
      <Tooltip content="Møtte for sent opp (gir 1 prikk)">
        <div
          className={cx(
            styles.tooLateIcon,
            presence !== 'LATE' && styles.transparent,
          )}
          onClick={() => {
            eventId &&
              dispatch(updatePresence(eventId, registrationId, Presence.LATE));
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-orange-6)"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m12 10 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a8 8 0 1 0-16 0v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3l2-4h4Z" />
            <path d="M4.82 7.9 8 10" />
            <path d="M15.18 7.9 12 10" />
            <path d="M16.93 10H20a2 2 0 0 1 0 4H2" />
          </svg>
        </div>
      </Tooltip>
      <TooltipIcon
        content="Ukjent"
        iconClass={styles.questionIcon}
        iconName="help-outline"
        transparent={presence !== 'UNKNOWN'}
        onClick={() =>
          eventId &&
          dispatch(updatePresence(eventId, registrationId, Presence.UNKNOWN))
        }
      />
      <TooltipIcon
        content="Møtte ikke opp (gir 2 prikker)"
        iconClass={styles.redIcon}
        iconName="close-outline"
        transparent={presence !== 'NOT_PRESENT'}
        onClick={() =>
          eventId &&
          dispatch(
            updatePresence(eventId, registrationId, Presence.NOT_PRESENT),
          )
        }
      />
    </Flex>
  );
};

export const StripeStatus = ({
  registrationId,
  paymentStatus,
}: StripeStatusProps) => {
  const { eventId } = useParams<{ eventId: string }>();
  const dispatch = useAppDispatch();

  return (
    <Flex alignItems="center" justifyContent="center">
      <TooltipIcon
        content="Betalt via Stripe"
        iconClass={cx('fa fa-cc-stripe', styles.greenIcon)}
        transparent={paymentStatus !== 'succeeded'}
        disabled
      />
      <TooltipIcon
        content="Betalt manuelt"
        transparent={paymentStatus !== 'manual'}
        iconName="cash-outline"
        iconClass={styles.greenIcon}
        onClick={() =>
          eventId && dispatch(updatePayment(eventId, registrationId, 'manual'))
        }
      />
      <TooltipIcon
        content="Ikke betalt"
        transparent={['manual', 'succeeded'].includes(paymentStatus ?? '')}
        iconName="close-outline"
        iconClass={styles.redIcon}
        onClick={() =>
          eventId && dispatch(updatePayment(eventId, registrationId, 'failed'))
        }
      />
    </Flex>
  );
};

export const Unregister = ({ fetching, registration }: UnregisterProps) => {
  const { eventId } = useParams<{ eventId: string }>();
  const dispatch = useAppDispatch();

  return (
    <>
      {fetching ? (
        <LoadingIndicator loading small />
      ) : (
        <ConfirmModal
          title="Bekreft avregistrering"
          message={`Er du sikker på at du vil melde av "${registration.user.fullName}"?`}
          onConfirm={() => {
            eventId &&
              dispatch(
                unregister({
                  eventId,
                  registrationId: registration.id,
                  admin: true,
                }),
              );
          }}
          closeOnConfirm
        >
          {({ openConfirmModal }) => (
            <Flex justifyContent="center">
              <Tooltip content="Meld av bruker">
                <Icon
                  onClick={openConfirmModal}
                  name="person-remove-outline"
                  size={18}
                  danger
                />
              </Tooltip>
            </Flex>
          )}
        </ConfirmModal>
      )}
    </>
  );
};
