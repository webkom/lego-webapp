import { Flex, Icon, LoadingIndicator } from '@webkom/lego-bricks';
import cx from 'classnames';
import { ConfirmModal } from 'app/components/Modal/ConfirmModal';
import Tooltip from 'app/components/Tooltip';
import type {
  EventRegistration,
  EventRegistrationPaymentStatus,
  EventRegistrationPresence,
  ID,
} from 'app/models';
import styles from './Administrate.css';

type TooltipIconProps = {
  onClick?: (arg0: React.SyntheticEvent<any>) => unknown;
  content: string;
  transparent?: boolean;
  iconClass: string;
};
type PresenceProps = {
  handlePresence: (arg0: ID, arg1: EventRegistrationPresence) => Promise<any>;
  presence: EventRegistrationPresence;
  id: ID;
};
type UnregisterProps = {
  fetching: boolean;
  handleUnregister: (arg0: ID) => Promise<void>;
  registration: EventRegistration;
};
type StripeStatusProps = {
  id: ID;
  handlePayment: (
    registrationId: ID,
    paymentStatus: EventRegistrationPaymentStatus
  ) => Promise<any>;
  paymentStatus: EventRegistrationPaymentStatus;
};

export const TooltipIcon = ({
  onClick,
  content,
  transparent,
  iconClass,
}: TooltipIconProps) => {
  return (
    <Tooltip content={content}>
      <button
        className={cx(transparent && styles.transparent)}
        onClick={onClick}
      >
        <i className={iconClass} />
      </button>
    </Tooltip>
  );
};

export const PresenceIcons = ({
  handlePresence,
  presence,
  id,
}: PresenceProps) => {
  return (
    <Flex justifyContent="center" gap={5}>
      <TooltipIcon
        content="Til stede"
        iconClass={cx('fa fa-check', styles.greenIcon)}
        transparent={presence !== 'PRESENT'}
        onClick={() => handlePresence(id, 'PRESENT')}
      />
      <TooltipIcon
        content="Ukjent"
        iconClass={cx('fa fa-question-circle', styles.questionIcon)}
        transparent={presence !== 'UNKNOWN'}
        onClick={() => handlePresence(id, 'UNKNOWN')}
      />
      <TooltipIcon
        content="Ikke til stede"
        iconClass={cx('fa fa-times', styles.redIcon)}
        transparent={presence !== 'NOT_PRESENT'}
        onClick={() => handlePresence(id, 'NOT_PRESENT')}
      />
    </Flex>
  );
};

export const StripeStatus = ({
  id,
  handlePayment,
  paymentStatus,
}: StripeStatusProps) => (
  <Flex justifyContent="center" gap={5}>
    <TooltipIcon
      content="Betalt stripe"
      iconClass={cx('fa fa-cc-stripe', styles.greenIcon)}
      transparent={paymentStatus !== 'succeeded'}
    />
    <TooltipIcon
      content="Betalt manuelt"
      transparent={paymentStatus !== 'manual'}
      iconClass={cx('fa fa-money', styles.greenIcon)}
      onClick={() => handlePayment(id, 'manual')}
    />
    <TooltipIcon
      content="Ikke betalt"
      transparent={['manual', 'succeeded'].includes(paymentStatus)}
      iconClass={cx('fa fa-times', styles.redIcon)}
      onClick={() => handlePayment(id, 'failed')}
    />
  </Flex>
);

export const Unregister = ({
  fetching,
  handleUnregister,
  registration,
}: UnregisterProps) => {
  return (
    <>
      {fetching ? (
        <LoadingIndicator loading small />
      ) : (
        <ConfirmModal
          title="Bekreft utmelding"
          message={`Er du sikker på at du vil melde av "${registration.user.fullName}"?`}
          onConfirm={() => handleUnregister(registration.id)}
          closeOnCancel
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
