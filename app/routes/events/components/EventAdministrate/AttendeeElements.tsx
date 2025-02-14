import {
  ConfirmModal,
  Flex,
  Icon,
  LoadingIndicator,
} from '@webkom/lego-bricks';
import cx from 'classnames';
import { Check, HelpCircle, Turtle, X } from 'lucide-react';
import { Button } from 'react-aria-components';
import { useParams } from 'react-router';
import {
  unregister,
  updatePayment,
  updatePresence,
} from 'app/actions/EventActions';
import Tooltip from 'app/components/Tooltip';
import { useAppDispatch } from 'app/store/hooks';
import { Presence } from 'app/store/models/Registration';
import styles from './Administrate.module.css';
import type { EntityId } from '@reduxjs/toolkit';
import type { EventRegistrationPaymentStatus } from 'app/models';
import type { SelectedAdminRegistration } from 'app/reducers/events';
import type { ReactNode } from 'react';
import type { PressEvent } from 'react-aria-components';

type TooltipIconProps = {
  onPress?: (e: PressEvent) => void;
  content: string;
  transparent?: boolean;
  iconNode?: ReactNode;
  iconClass: string;
  disabled?: boolean;
  success?: boolean;
  edit?: boolean;
  danger?: boolean;
  info?: boolean;
};
type PresenceProps = {
  presence: Presence;
  registrationId: EntityId;
};
type UnregisterProps = {
  fetching: boolean;
  registration: SelectedAdminRegistration;
  isUnregistrationClosed: boolean;
};
type StripeStatusProps = {
  registrationId: EntityId;
  paymentStatus: EventRegistrationPaymentStatus | null;
};

export const TooltipIcon = ({
  onPress,
  content,
  transparent,
  iconNode,
  iconClass,
  disabled = false,
  success,
  edit,
  danger,
  info,
}: TooltipIconProps) => {
  const classNames = cx(iconClass, transparent && styles.transparent);

  return (
    <Tooltip content={content}>
      {iconNode ? (
        <Icon
          iconNode={iconNode}
          className={classNames}
          onPress={onPress}
          disabled={disabled}
          size={22}
          success={success}
          edit={edit}
          danger={danger}
          info={info}
        />
      ) : (
        <Button onPress={onPress} isDisabled={disabled}>
          <i className={classNames} />
        </Button>
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
        iconNode={<Check />}
        iconClass={cx(
          presence !== 'PRESENT' && styles.transparent,
          presence === 'PRESENT' && styles.activeSuccess,
        )}
        success={presence === 'PRESENT'}
        onPress={() =>
          eventId &&
          dispatch(updatePresence(eventId, registrationId, Presence.PRESENT))
        }
      />
      <TooltipIcon
        content="Møtte for sent opp (gir 1 prikk)"
        iconNode={<Turtle />}
        iconClass={cx(
          presence !== 'LATE' && styles.transparent,
          presence === 'LATE' && styles.activeEdit,
        )}
        edit={presence === 'LATE'}
        onPress={() =>
          eventId &&
          dispatch(updatePresence(eventId, registrationId, Presence.LATE))
        }
      />
      <TooltipIcon
        content="Ukjent"
        iconNode={<HelpCircle />}
        iconClass={cx(
          presence !== 'UNKNOWN' && styles.transparent,
          presence === 'UNKNOWN' && styles.activeInfo,
        )}
        info={presence === 'UNKNOWN'}
        onPress={() =>
          eventId &&
          dispatch(updatePresence(eventId, registrationId, Presence.UNKNOWN))
        }
      />
      <TooltipIcon
        content="Møtte ikke opp (gir 2 prikker)"
        iconNode={<X />}
        iconClass={cx(
          presence !== 'NOT_PRESENT' && styles.transparent,
          presence === 'NOT_PRESENT' && styles.activeDanger,
        )}
        danger={presence === 'NOT_PRESENT'}
        onPress={() =>
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
        onPress={() =>
          eventId && dispatch(updatePayment(eventId, registrationId, 'manual'))
        }
      />
      <TooltipIcon
        content="Ikke betalt"
        transparent={['manual', 'succeeded'].includes(paymentStatus ?? '')}
        iconName="close-outline"
        iconClass={styles.redIcon}
        onPress={() =>
          eventId && dispatch(updatePayment(eventId, registrationId, 'failed'))
        }
      />
    </Flex>
  );
};

export const Unregister = ({
  fetching,
  registration,
  isUnregistrationClosed,
}: UnregisterProps) => {
  const dispatch = useAppDispatch();
  const { eventId } = useParams<{ eventId: string }>();

  return (
    <>
      {fetching ? (
        <LoadingIndicator loading small />
      ) : (
        <ConfirmModal
          title="Bekreft avregistrering"
          message={`Er du sikker på at du vil melde av "${registration.user.fullName}"?`}
          onConfirm={() => {
            if (!eventId) return;
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
              <Tooltip
                content={
                  isUnregistrationClosed
                    ? 'Avregistreringsfrist har gått ut'
                    : 'Meld av bruker'
                }
              >
                <Icon
                  disabled={isUnregistrationClosed}
                  onPress={openConfirmModal}
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
