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
import styles from './Administrate.css';
import type {
  EventRegistration,
  EventRegistrationPaymentStatus,
  EventRegistrationPresence,
  ID,
} from 'app/models';

type TooltipIconProps = {
  onClick?: (arg0: React.SyntheticEvent<any>) => unknown;
  content: string;
  transparent?: boolean;
  iconClass: string;
  disabled?: boolean;
};
type PresenceProps = {
  presence: EventRegistrationPresence;
  registrationId: ID;
};
type UnregisterProps = {
  fetching: boolean;
  registration: EventRegistration;
};
type StripeStatusProps = {
  registrationId: ID;
  paymentStatus: EventRegistrationPaymentStatus;
};

export const TooltipIcon = ({
  onClick,
  content,
  transparent,
  iconClass,
  disabled = false,
}: TooltipIconProps) => {
  return (
    <Tooltip content={content}>
      <button
        className={cx(transparent && styles.transparent)}
        onClick={onClick}
        disabled={disabled}
      >
        <i className={iconClass} />
      </button>
    </Tooltip>
  );
};

export const PresenceIcons = ({ presence, registrationId }: PresenceProps) => {
  const { eventId } = useParams<{ eventId: string }>();
  const dispatch = useAppDispatch();

  return (
    <Flex justifyContent="center" gap={5}>
      <TooltipIcon
        content="Til stede"
        iconClass={cx('fa fa-check', styles.greenIcon)}
        transparent={presence !== 'PRESENT'}
        onClick={() =>
          dispatch(updatePresence(eventId, registrationId, 'PRESENT'))
        }
      />
      <TooltipIcon
        content="Ukjent"
        iconClass={cx('fa fa-question-circle', styles.questionIcon)}
        transparent={presence !== 'UNKNOWN'}
        onClick={() =>
          dispatch(updatePresence(eventId, registrationId, 'UNKNOWN'))
        }
      />
      <TooltipIcon
        content="Ikke til stede"
        iconClass={cx('fa fa-times', styles.redIcon)}
        transparent={presence !== 'NOT_PRESENT'}
        onClick={() =>
          dispatch(updatePresence(eventId, registrationId, 'NOT_PRESENT'))
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
    <Flex justifyContent="center" gap={5}>
      <TooltipIcon
        content="Betalt via Stripe"
        iconClass={cx('fa fa-cc-stripe', styles.greenIcon)}
        transparent={paymentStatus !== 'succeeded'}
        disabled
      />
      <TooltipIcon
        content="Betalt manuelt"
        transparent={paymentStatus !== 'manual'}
        iconClass={cx('fa fa-money', styles.greenIcon)}
        onClick={() =>
          dispatch(updatePayment(eventId, registrationId, 'manual'))
        }
      />
      <TooltipIcon
        content="Ikke betalt"
        transparent={['manual', 'succeeded'].includes(paymentStatus)}
        iconClass={cx('fa fa-times', styles.redIcon)}
        onClick={() =>
          dispatch(updatePayment(eventId, registrationId, 'failed'))
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
            dispatch(
              unregister({
                eventId,
                registrationId: registration.id,
                admin: true,
              })
            );
          }}
          closeOnConfirm
        >
          {({ openConfirmModal }) => (
            <Tooltip content="Meld av bruker">
              <Icon
                onClick={openConfirmModal}
                name="person-remove-outline"
                size={18}
                danger
              />
            </Tooltip>
          )}
        </ConfirmModal>
      )}
    </>
  );
};
