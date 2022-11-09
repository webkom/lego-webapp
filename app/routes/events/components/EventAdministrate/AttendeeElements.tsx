import cx from 'classnames';
import Button from 'app/components/Button';
import { Flex } from 'app/components/Layout';
import LoadingIndicator from 'app/components/LoadingIndicator';
import Tooltip from 'app/components/Tooltip';
import type {
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
  handleUnregister: (arg0: ID) => void;
  id: ID;
  clickedUnregister: ID;
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
    <Tooltip className={styles.cell} content={content}>
      <Button
        flat
        className={cx(transparent && styles.transparent)}
        onClick={onClick}
      >
        <i className={iconClass} />
      </Button>
    </Tooltip>
  );
};
export const PresenceIcons = ({
  handlePresence,
  presence,
  id,
}: PresenceProps) => {
  return (
    <Flex className={styles.presenceIcons}>
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
  <Flex className={styles.presenceIcons}>
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
  id,
  clickedUnregister,
}: UnregisterProps) => {
  return (
    <div>
      {fetching ? (
        <LoadingIndicator loading={true} small />
      ) : (
        <Button flat onClick={() => handleUnregister(id)}>
          <i
            className="fa fa-minus-circle"
            style={{
              color: '#C24538',
              marginRight: '5px',
            }}
          />
          {clickedUnregister === id ? 'Er du sikker?' : 'Meld av'}
        </Button>
      )}
    </div>
  );
};
