import { Flex, Skeleton } from '@webkom/lego-bricks';
import { PhotoConsentDomain } from 'app/models';
import TextWithIcon from '~/components/TextWithIcon';
import styles from '~/pages/events/@eventIdOrSlug/EventDetail.module.css';
import {
  paymentPending,
  paymentCardDeclined,
  paymentSuccess,
  paymentManual,
  paymentCardExpired,
  getConsent,
  allConsentsAnswered,
  toReadableSemester,
} from '~/pages/events/utils';
import type {
  EventRegistrationPaymentStatus,
  LEGACY_EventRegistrationPhotoConsent,
  PhotoConsent,
  EventSemester,
} from 'app/models';
import type { TextWithIconProps } from '~/components/TextWithIcon';
import type { Presence } from '~/redux/models/Registration';
import type { PoolRegistrationWithUser } from '~/redux/slices/events';

type WaitingListPosition =
  | number
  | {
      poolName: string;
      position: number;
    }[];

type Props = {
  registration?: PoolRegistrationWithUser;
  isPriced: boolean;
  waitingListPosition?: WaitingListPosition;
  useConsent: boolean;
  fiveMinutesBeforeActivation: boolean;
  hasEnded: boolean;
  photoConsents?: Array<PhotoConsent>;
  eventSemester: EventSemester;
};

const TextWithIconWrapper = (props: TextWithIconProps) => (
  <TextWithIcon size={20} gap={2} className={styles.sidebarInfo} {...props} />
);

const ConsentStatus = ({
  useConsent,
  LEGACY_photoConsent,
  hasEnded,
  photoConsents,
  eventSemester,
}: {
  useConsent: boolean;
  LEGACY_photoConsent?: LEGACY_EventRegistrationPhotoConsent;
  hasEnded: boolean;
  photoConsents?: Array<PhotoConsent>;
  eventSemester: EventSemester;
}) => {
  if (!useConsent) return null;

  if (photoConsents && allConsentsAnswered(photoConsents)) {
    const { WEBSITE, SOCIAL_MEDIA } = PhotoConsentDomain;
    const isConsentingWeb = getConsent(
      WEBSITE,
      eventSemester.year,
      eventSemester.semester,
      photoConsents,
    )?.isConsenting;
    const isConsentingSoMe = getConsent(
      SOCIAL_MEDIA,
      eventSemester.year,
      eventSemester.semester,
      photoConsents,
    )?.isConsenting;
    const readableEventSemester = toReadableSemester(eventSemester);

    if (isConsentingWeb && isConsentingSoMe) {
      return (
        <TextWithIconWrapper
          iconName="camera-outline"
          content={`Du samtykker til bilder på abakus.no og sosiale medier for semesteret ${readableEventSemester}`}
        />
      );
    }

    if (!isConsentingWeb && !isConsentingSoMe) {
      return (
        <TextWithIconWrapper
          iconName="close-circle-outline"
          content={`Du samtykker ikke til bilder for semesteret ${readableEventSemester}`}
        />
      );
    }

    if (isConsentingWeb && !isConsentingSoMe) {
      return (
        <TextWithIconWrapper
          iconName="desktop-outline"
          content={`Du samtykker kun til bilder på abakus.no for semesteret ${readableEventSemester}`}
        />
      );
    }

    if (!isConsentingWeb && isConsentingSoMe) {
      return (
        <TextWithIconWrapper
          iconName="share-social-outline"
          content={`Du samtykker kun til bilder på sosiale medier for semesteret ${readableEventSemester}`}
        />
      );
    }
  }

  if (LEGACY_photoConsent === 'PHOTO_CONSENT') {
    return (
      <TextWithIconWrapper
        iconName="checkmark-circle-outline"
        content="Du samtykker til bilder fra dette arrangementet"
      />
    );
  }

  if (LEGACY_photoConsent === 'PHOTO_NOT_CONSENT') {
    return (
      <TextWithIconWrapper
        iconName="close-circle-outline"
        content="Du samtykker ikke til bilder fra dette arrangementet"
      />
    );
  }

  if (LEGACY_photoConsent === 'UNKNOWN' && hasEnded) {
    return (
      <TextWithIconWrapper
        iconName="alert-circle-outline"
        content="Du tok ikke stilling til bildesamtykke på dette arrangementet"
      />
    );
  }

  return (
    <TextWithIconWrapper
      iconName="alert-circle-outline"
      content="Dette arrangement krever bildesamtykke"
    />
  );
};

const PresenceStatus = ({
  presence,
  hasEnded,
}: {
  hasEnded: boolean;
  presence: Presence;
}) => {
  switch (presence) {
    case 'NOT_PRESENT':
      return (
        <TextWithIconWrapper
          iconName="alert-circle-outline"
          content="Du møtte ikke opp"
        />
      );

    case 'PRESENT':
      return (
        <TextWithIconWrapper
          iconName="checkmark-circle-outline"
          content="Du møtte opp"
        />
      );

    case 'UNKNOWN':
      if (!hasEnded) return null;
      return (
        <TextWithIconWrapper
          iconName="help-circle-outline"
          content="Oppmøte ble ikke sjekket"
        />
      );

    default:
      return null;
  }
};

const PaymentStatus = ({
  paymentStatus,
  isPriced,
}: {
  paymentStatus?: EventRegistrationPaymentStatus | null;
  isPriced: boolean;
}) => {
  if (!isPriced) return null;

  switch (paymentStatus) {
    case paymentPending:
      return (
        <TextWithIconWrapper
          iconName="alert-circle-outline"
          content="Betaling pågår"
        />
      );

    case paymentManual:
    case paymentSuccess:
      return (
        <TextWithIconWrapper
          iconName="checkmark-circle-outline"
          content="Du har betalt"
        />
      );

    case paymentCardDeclined:
      return (
        <TextWithIconWrapper
          iconName="alert-circle-outline"
          content="Du har ikke betalt. Kortet du prøvde å betale med ble ikke godtatt"
        />
      );

    case paymentCardExpired:
      return (
        <TextWithIconWrapper
          iconName="alert-circle-outline"
          content="Du har ikke betalt. Kortet du prøvde å betale med har gått ut på dato"
        />
      );

    default:
      return (
        <TextWithIconWrapper
          iconName="alert-circle-outline"
          content="Du har ikke betalt"
        />
      );
  }
};

export const RegistrationMetaSkeleton = () => (
  <Flex column gap="var(--spacing-sm)" className={styles.registrationMeta}>
    <Skeleton array={2} className={styles.sidebarInfo} />
  </Flex>
);

const RegistrationMeta = ({
  registration,
  fiveMinutesBeforeActivation,
  hasEnded,
  useConsent,
  isPriced,
  waitingListPosition,
  photoConsents,
  eventSemester,
}: Props) => {
  return (
    <Flex column gap="var(--spacing-sm)" className={styles.registrationMeta}>
      {!registration && fiveMinutesBeforeActivation && (
        <TextWithIconWrapper
          iconName="close-circle-outline"
          content={`Du ${hasEnded ? 'var' : 'er'} ikke påmeldt`}
        />
      )}
      {registration && (
        <>
          {registration.pool ? (
            <>
              {!hasEnded && (
                <TextWithIconWrapper
                  iconName="checkmark-circle-outline"
                  content={
                    <>
                      Du er påmeldt og samtykker til{' '}
                      <a href="/pages/arrangementer/26-arrangementsregler">
                        arrangementsreglene
                      </a>
                    </>
                  }
                />
              )}
            </>
          ) : (
            <TextWithIconWrapper
              iconName="pause-circle-outline"
              content={
                waitingListPosition === undefined ? (
                  <>Du {hasEnded ? 'stod' : 'står'} på venteliste</>
                ) : typeof waitingListPosition === 'number' ? (
                  <>
                    Din plass i ventelisten er{' '}
                    <strong>{waitingListPosition}</strong>
                  </>
                ) : waitingListPosition.length === 1 ? (
                  <>
                    Din plass i ventelisten for{' '}
                    {waitingListPosition[0].poolName} er{' '}
                    <strong>{waitingListPosition[0].position}</strong>
                  </>
                ) : (
                  <>
                    Dine plasser i ventelistene er{' '}
                    {waitingListPosition.map(
                      ({ poolName, position }, index) => (
                        <>
                          <strong>{position}</strong> for {poolName}
                          {index < waitingListPosition.length - 2
                            ? ', '
                            : index < waitingListPosition.length - 1 && ' og '}
                        </>
                      ),
                    )}
                  </>
                )
              }
            />
          )}
          <PresenceStatus
            presence={registration.presence}
            hasEnded={hasEnded}
          />
          {hasEnded && (
            <TextWithIconWrapper
              iconName="checkmark-circle-outline"
              content={
                <>
                  Du samtykket til{' '}
                  <a href="/pages/arrangementer/26-arrangementsregler">
                    arrangementsreglene
                  </a>
                </>
              }
            />
          )}
          <PaymentStatus
            isPriced={isPriced}
            paymentStatus={
              'paymentStatus' in registration
                ? registration.paymentStatus
                : undefined
            }
          />
        </>
      )}
      <ConsentStatus
        useConsent={useConsent}
        hasEnded={hasEnded}
        LEGACY_photoConsent={registration?.LEGACYPhotoConsent}
        photoConsents={photoConsents}
        eventSemester={eventSemester}
      />
    </Flex>
  );
};

export default RegistrationMeta;
