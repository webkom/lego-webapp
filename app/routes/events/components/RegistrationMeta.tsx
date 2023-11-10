import { Flex } from '@webkom/lego-bricks';
import { PhotoConsentDomain } from 'app/models';
import {
  paymentPending,
  paymentCardDeclined,
  paymentSuccess,
  paymentManual,
  paymentCardExpired,
  getConsent,
  allConsentsAnswered,
  toReadableSemester,
} from '../utils';
import type {
  EventRegistrationPresence,
  EventRegistrationPaymentStatus,
  LEGACY_EventRegistrationPhotoConsent,
  PhotoConsent,
  EventSemester,
} from 'app/models';

type Props = {
  registration: Record<string, any>;
  isPriced: boolean;
  registrationIndex: number;
  hasSimpleWaitingList: boolean;
  useConsent: boolean;
  hasOpened: boolean;
  hasEnded: boolean;
  photoConsents?: Array<PhotoConsent>;
  eventSemester: EventSemester;
};

const ConsentInfo = ({
  className,
  consentDescription,
}: {
  className: string;
  consentDescription: string;
}) => (
  <div>
    <i className={className} />
    {' ' + consentDescription}
  </div>
);

const ConsentStatus = ({
  useConsent,
  LEGACY_photoConsent,
  hasEnded,
  photoConsents,
  eventSemester,
}: {
  useConsent: boolean;
  LEGACY_photoConsent: LEGACY_EventRegistrationPhotoConsent;
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
        <ConsentInfo
          className={'fa fa-camera'}
          consentDescription={`Du samtykker til bilder på abakus.no og sosiale medier for semesteret ${readableEventSemester}`}
        />
      );
    }

    if (!isConsentingWeb && !isConsentingSoMe) {
      return (
        <ConsentInfo
          className={'fa fa-times-circle'}
          consentDescription={`Du samtykker ikke til bilder for semesteret ${readableEventSemester}`}
        />
      );
    }

    if (isConsentingWeb && !isConsentingSoMe) {
      return (
        <ConsentInfo
          className={'fa fa-desktop'}
          consentDescription={`Du samtykker kun til bilder på
          Abakus.no for semesteret ${readableEventSemester}`}
        />
      );
    }

    if (!isConsentingWeb && isConsentingSoMe) {
      return (
        <ConsentInfo
          className={'fa fa-share-square'}
          consentDescription={`Du samtykker kun til bilder på
          sosiale medier for semesteret ${readableEventSemester}`}
        />
      );
    }
  }

  if (LEGACY_photoConsent === 'PHOTO_CONSENT') {
    return (
      <ConsentInfo
        className={'fa fa-check-circle'}
        consentDescription={'Du samtykker til bilder fra dette arrangementet'}
      />
    );
  }

  if (LEGACY_photoConsent === 'PHOTO_NOT_CONSENT') {
    return (
      <ConsentInfo
        className={'fa fa-times-circle'}
        consentDescription={
          'Du samtykker ikke til bilder fra dette arrangementet'
        }
      />
    );
  }

  if (LEGACY_photoConsent === 'UNKNOWN' && hasEnded) {
    return (
      <ConsentInfo
        className={'fa fa-exclamation-circle'}
        consentDescription={
          'Du tok ikke stilling til bildesamtykke på dette arrangementet'
        }
      />
    );
  }

  return (
    <ConsentInfo
      className={'fa fa-exclamation-circle'}
      consentDescription={'Dette arrangement krever bildesamtykke'}
    />
  );
};

const PresenceStatus = ({
  presence,
  hasEnded,
}: {
  hasEnded: boolean;
  presence: EventRegistrationPresence;
}) => {
  switch (presence) {
    case 'NOT_PRESENT':
      return (
        <div>
          <i className="fa fa-exclamation-circle" /> Du møtte ikke opp på
          arrangementet
        </div>
      );

    case 'PRESENT':
      return (
        <div>
          <i className="fa fa-check-circle" /> Du møtte opp på arrangementet
        </div>
      );

    case 'UNKNOWN':
      if (!hasEnded) return null;
      return (
        <div>
          <i className="fa fa-check-circle" /> Oppmøte ble ikke sjekket
        </div>
      );

    default:
      return null;
  }
};

const PaymentStatus = ({
  paymentStatus,
  isPriced,
}: {
  paymentStatus: EventRegistrationPaymentStatus;
  isPriced: boolean;
}) => {
  if (!isPriced) return null;

  switch (paymentStatus) {
    case paymentPending:
      return (
        <div>
          <i className="fa fa-exclamation-circle" /> Betaling pågår
        </div>
      );

    case paymentManual:
    case paymentSuccess:
      return (
        <div>
          <i className="fa fa-check-circle" /> Du har betalt
        </div>
      );

    case paymentCardDeclined:
      return (
        <div>
          <i className="fa fa-exclamation-circle" /> Du har ikke betalt. Kortet
          du prøvde å betale med ble ikke godtatt.
        </div>
      );

    case paymentCardExpired:
      return (
        <div>
          <i className="fa fa-exclamation-circle" /> Du har ikke betalt. Kortet
          du prøvde å betale med har gått ut på dato.
        </div>
      );

    default:
      return (
        <div>
          <i className="fa fa-exclamation-circle" /> Du har ikke betalt
        </div>
      );
  }
};

const RegistrationMeta = ({
  registration,
  hasOpened,
  hasEnded,
  useConsent,
  isPriced,
  registrationIndex,
  hasSimpleWaitingList,
  photoConsents,
  eventSemester,
}: Props) => (
  <Flex column gap={5}>
    {!registration && hasOpened && (
      <div>
        <i className="fa fa-times-circle" /> Du {hasEnded ? 'var' : 'er'} ikke
        påmeldt
      </div>
    )}
    {registration && (
      <>
        {registration.pool ? (
          <>
            {!hasEnded && (
              <div>
                <i className="fa fa-check-circle" /> Du er påmeldt
              </div>
            )}
          </>
        ) : hasSimpleWaitingList ? (
          <div>
            <i className="fa fa-pause-circle" /> Din plass i ventelisten:{' '}
            <strong>{registrationIndex + 1}</strong>
          </div>
        ) : (
          <div>
            <i className="fa fa-pause-circle" /> Du {hasEnded ? 'stod' : 'står'}{' '}
            på venteliste
          </div>
        )}
        <PresenceStatus presence={registration.presence} hasEnded={hasEnded} />
        <PaymentStatus
          isPriced={isPriced}
          paymentStatus={registration.paymentStatus}
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

export default RegistrationMeta;
