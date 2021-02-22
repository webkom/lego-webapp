// @flow

import type {
  EventRegistrationPresence,
  EventRegistrationPaymentStatus,
  LEGACY_EventRegistrationPhotoConsent,
  PhotoConsent,
} from 'app/models';
import {
  paymentPending,
  paymentCardDeclined,
  paymentSuccess,
  paymentManual,
  paymentCardExpired,
} from '../utils';

type Props = {
  registration: Object,
  isPriced: boolean,
  registrationIndex: number,
  hasSimpleWaitingList: boolean,
  useConsent: boolean,
  hasEnded: boolean,
  photoConsents?: Array<PhotoConsent>,
  eventSemester: string,
};

const ConsentStatus = ({
  useConsent,
  LEGACY_photoConsent,
  hasEnded,
  photoConsents,
  eventSemester,
}: {
  useConsent: boolean,
  LEGACY_photoConsent: LEGACY_EventRegistrationPhotoConsent,
  hasEnded: boolean,
  photoConsents?: Array<PhotoConsent>,
  eventSemester: string,
}) => {
  if (!useConsent) return null;
  let isConsentingWeb;
  let isConsentingSoMe;

  if (photoConsents !== undefined) {
    isConsentingWeb = photoConsents.find(
      (consent) =>
        consent.domain === 'WEBSITE' && consent.semester === eventSemester
    )?.isConsenting;

    isConsentingSoMe = photoConsents.find(
      (consent) =>
        consent.domain === 'SOCIAL_MEDIA' && consent.semester === eventSemester
    )?.isConsenting;
  }

  if (
    typeof isConsentingWeb === 'boolean' &&
    typeof isConsentingWeb === 'boolean'
  ) {
    if (isConsentingWeb && isConsentingSoMe) {
      return (
        <div>
          <i className="fa fa-check-circle" /> Du samtykker til bilder på
          Abakus.no og sosiale medier for semesteret {eventSemester}.
        </div>
      );
    } else if (!isConsentingWeb && !isConsentingSoMe) {
      return (
        <div>
          <i className="fa fa-times-circle" /> Du samtykker ikke til bilder for
          semesteret {eventSemester}.
        </div>
      );
    } else if (isConsentingWeb && !isConsentingSoMe) {
      return (
        <div>
          <i className="fa fa-circle" /> Du samtykker kun til bilder på
          Abakus.no for semesteret {eventSemester}.
        </div>
      );
    } else if (!isConsentingWeb && isConsentingSoMe) {
      return (
        <div>
          <i className="fa fa-facebook-square" /> Du samtykker kun til bilder på
          sosiale medier for semesteret {eventSemester}.
        </div>
      );
    }
  }

  if (LEGACY_photoConsent === 'PHOTO_CONSENT') {
    return (
      <div>
        <i className="fa fa-check-circle" /> Du samtykker til bilder fra dette
        arrangementet.
      </div>
    );
  } else if (LEGACY_photoConsent === 'PHOTO_NOT_CONSENT') {
    return (
      <div>
        <i className="fa fa-times-circle" /> Du samtykker ikke til bilder fra
        dette arrangementet.
      </div>
    );
  } else if (LEGACY_photoConsent === 'UNKNOWN' && hasEnded) {
    return (
      <div>
        <i className="fa fa-exclamation-circle" /> Du tok ikke stilling til
        bildesamtykke på dette arrangementet.
      </div>
    );
  }

  return (
    <div>
      <i className="fa fa-exclamation-circle" /> Dette arrangement krever
      bildesamtykke.
    </div>
  );
};
const PresenceStatus = ({
  presence,
  hasEnded,
}: {
  hasEnded: boolean,
  presence: EventRegistrationPresence,
}) => {
  switch (presence) {
    case 'NOT_PRESENT':
      return (
        <>
          <i className="fa fa-exclamation-circle" /> Du møtte ikke opp på
          arrangementet
        </>
      );
    case 'PRESENT':
      return (
        <>
          <i className="fa fa-check-circle" /> Du møtte opp på arrangementet
        </>
      );
    case 'UNKNOWN':
      if (!hasEnded) return null;
      return (
        <>
          <i className="fa fa-check-circle" /> Oppmøte ble ikke sjekket
        </>
      );
    default:
      return null;
  }
};

const PaymentStatus = ({
  paymentStatus,
  isPriced,
}: {
  paymentStatus: EventRegistrationPaymentStatus,
  isPriced: boolean,
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
        <>
          <i className="fa fa-exclamation-circle" /> Du har ikke betalt. Kortet
          du prøvde å betale med ble ikke godtatt.
        </>
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
  hasEnded,
  useConsent,
  isPriced,
  registrationIndex,
  hasSimpleWaitingList,
  photoConsents,
  eventSemester,
}: Props) => (
  <div>
    {!registration && (
      <div>
        <i className="fa fa-exclamation-circle" /> Du er ikke påmeldt
      </div>
    )}
    {registration && (
      <div>
        {registration.pool ? (
          <div>
            <i className="fa fa-check-circle" /> Du er påmeldt
          </div>
        ) : hasSimpleWaitingList ? (
          <div>
            <i className="fa fa-pause-circle" /> Din plass i venteliste{' '}
            <strong>{registrationIndex + 1}</strong>
          </div>
        ) : (
          <div>
            <i className="fa fa-pause-circle" /> Du er i venteliste
          </div>
        )}
        <PresenceStatus presence={registration.presence} hasEnded={hasEnded} />
        <PaymentStatus
          isPriced={isPriced}
          paymentStatus={registration.paymentStatus}
        />
      </div>
    )}
    <ConsentStatus
      useConsent={useConsent}
      hasEnded={hasEnded}
      LEGACY_photoConsent={registration?.LEGACYPhotoConsent}
      photoConsents={photoConsents}
      eventSemester={eventSemester}
    />
  </div>
);

export default RegistrationMeta;
