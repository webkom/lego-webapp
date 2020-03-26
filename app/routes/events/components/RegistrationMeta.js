// @flow

import React from 'react';
import type {
  EventRegistrationPresence,
  EventRegistrationPaymentStatus,
  PhotoConsent,
} from 'app/models';
import {
  paymentPending,
  paymentCardDeclined,
  paymentSuccess,
  paymentManual,
  paymentCardExpired,
} from '../utils';
import Tooltip from 'app/components/Tooltip';

type Props = {
  registration: Object,
  isPriced: boolean,
  registrationIndex: number,
  hasSimpleWaitingList: boolean,
  hasEnded: boolean,
  photoConsents: Array<PhotoConsent>,
};

const ConsentStatus = ({
  photoConsents,
}: {
  photoConsents: Array<PhotoConsent>,
}) => {
  if (photoConsents == undefined) return;

  // TODO - set event semester to event start time
  const eventSemester = 'H20';
  const webConsent = photoConsents.find(
    (consent) =>
      consent.domain === 'WEBSITE' && consent.semester === eventSemester
  );
  const soMeConsent = photoConsents.find(
    (consent) =>
      consent.domain === 'SOCIAL_MEDIA' && consent.semester === eventSemester
  );

  if (webConsent == undefined || soMeConsent == undefined) return;

  const isConsentingWeb = webConsent.isConsenting;
  const isConsentingSoMe = soMeConsent.isConsenting;

  if (isConsentingWeb && isConsentingSoMe) {
    return (
      <div>
        <i className="fa fa-check-circle" /> Du samtykker til bilder på
        Abakus.no og sosiale medier for semesteret {webConsent.semester}.
      </div>
    );
  } else if (isConsentingWeb) {
    return (
      <div>
        <i className="fa fa-circle" /> Du samtykker kun til bilder på Abakus.no
        for semesteret {webConsent.semester}.
      </div>
    );
  } else if (isConsentingSoMe) {
    return (
      <div>
        <i className="fa fa-facebook-square" /> Du samtykker kun til bilder på
        sosiale medier for semesteret {webConsent.semester}.
      </div>
    );
  } else {
    return (
      <div>
        <i className="fa fa-times-circle" /> Du samtykker ikke til bilder for
        semesteret {webConsent.semester}.
      </div>
    );
  }
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
  isPriced,
  registrationIndex,
  hasSimpleWaitingList,
  photoConsents,
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
        <Tooltip content="Du kan når som helst trekke samtykket på profilsiden din.">
          <ConsentStatus photoConsents={photoConsents} />
        </Tooltip>
        <PaymentStatus
          isPriced={isPriced}
          paymentStatus={registration.paymentStatus}
        />
      </div>
    )}
  </div>
);

export default RegistrationMeta;
