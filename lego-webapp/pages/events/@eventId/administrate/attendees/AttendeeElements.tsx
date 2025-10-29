import {
  ConfirmModal,
  Flex,
  Icon,
  LoadingIndicator,
  Tooltip,
} from '@webkom/lego-bricks';
import cx from 'classnames';
import {
  Check,
  CreditCard,
  HandCoins,
  HelpCircle,
  Turtle,
  X,
} from 'lucide-react';
import { Button } from 'react-aria-components';
import {
  unregister,
  updatePayment,
  updatePresence,
} from '~/redux/actions/EventActions';
import { useAppDispatch } from '~/redux/hooks';
import { Presence } from '~/redux/models/Registration';
import { useParams } from '~/utils/useParams';
import styles from '../Administrate.module.css';
import type { EntityId } from '@reduxjs/toolkit';
import type { EventRegistrationPaymentStatus } from 'app/models';
import type { ReactNode } from 'react';
import type { PressEvent } from 'react-aria-components';
import type { SelectedAdminRegistration } from '~/redux/slices/events';

type TooltipIconProps = {
  onPress?: (e: PressEvent) => void;
  content: string;
  transparent?: boolean;
  iconNode?: ReactNode;
  iconClass?: string;
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
        iconClass={
          presence === 'PRESENT' ? styles.activeSuccess : styles.transparent
        }
        success={presence === 'PRESENT'}
        onPress={() =>
          eventId &&
          dispatch(updatePresence(eventId, registrationId, Presence.PRESENT))
        }
      />
      <TooltipIcon
        content="Møtte for sent opp (gi 1 prikk)"
        iconNode={<Turtle />}
        iconClass={presence === 'LATE' ? styles.activeEdit : styles.transparent}
        edit={presence === 'LATE'}
        onPress={() =>
          eventId &&
          dispatch(updatePresence(eventId, registrationId, Presence.LATE))
        }
      />
      <TooltipIcon
        content="Ukjent"
        iconNode={<HelpCircle />}
        iconClass={
          presence === 'UNKNOWN' ? styles.activeInfo : styles.transparent
        }
        info={presence === 'UNKNOWN'}
        onPress={() =>
          eventId &&
          dispatch(updatePresence(eventId, registrationId, Presence.UNKNOWN))
        }
      />
      <TooltipIcon
        content="Møtte ikke opp (gir 2 prikker)"
        iconNode={<X />}
        iconClass={
          presence === 'NOT_PRESENT' ? styles.activeDanger : styles.transparent
        }
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
        content="Betalt via nettsiden (Stripe)"
        iconNode={<CreditCard />}
        iconClass={
          paymentStatus === 'succeeded'
            ? styles.activeSuccess
            : styles.transparent
        }
        success={paymentStatus === 'succeeded'}
        onPress={() => {}}
        disabled
      />
      <TooltipIcon
        content="Betalt manuelt"
        iconNode={<HandCoins />}
        iconClass={
          paymentStatus === 'manual' ? styles.activeSuccess : styles.transparent
        }
        success={paymentStatus === 'manual'}
        onPress={() =>
          eventId && dispatch(updatePayment(eventId, registrationId, 'manual'))
        }
      />
      <TooltipIcon
        content="Ikke betalt"
        iconNode={<X />}
        iconClass={
          paymentStatus === 'failed' ? styles.activeDanger : styles.transparent
        }
        danger={paymentStatus === 'failed'}
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
