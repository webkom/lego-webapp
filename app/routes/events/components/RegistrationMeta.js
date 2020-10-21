// @flow

import React from 'react';
import type {
  EventRegistrationPresence,
  EventRegistrationPaymentStatus,
  EventRegistrationPhotoConsent,
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
  useConsent: boolean,
  hasEnded: boolean,
  shareInfoFlag: boolean,
};

const ConsentStatus = ({
  useConsent,
  photoConsent,
  hasEnded,
}: {
  useConsent: boolean,
  photoConsent: EventRegistrationPhotoConsent,
  hasEnded: boolean,
}) => {
  if (!useConsent) return null;
  switch (photoConsent) {
    case 'PHOTO_NOT_CONSENT':
      return (
        <div>
          <i className="fa fa-check-circle" /> Du har valgt <i>NEI</i> på
          samtykke om bilder
        </div>
      );
    case 'PHOTO_CONSENT':
      return (
        <div>
          <i className="fa fa-check-circle" /> Du har valgt <i>ja</i> på
          samtykke om bilder
        </div>
      );
    case 'UNKNOWN':
      if (!hasEnded) return null;
      return (
        <div>
          <i className="fa fa-exclamation-circle" /> Du har enda ikke tatt
          stilling til samtykke om bilder
        </div>
      );
    default:
      return null;
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
  useConsent,
  isPriced,
  registrationIndex,
  hasSimpleWaitingList,
  shareInfoFlag,
}: Props) => (
  <div>
    {!registration && (
      <div>
        <i className="fa fa-exclamation-circle" /> Du er ikke påmeldt
      </div>
    )}
    {shareInfoFlag && !registration && (
      <div>
        <i className="fa fa-exclamation-circle" /> Ved å melde deg på dette
        arrangementet samtykker du til at kontaktinformasjonen din (navn,
        telefonnummer og epost) kan deles med andre utenfor Abakus til
        smittesporing
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
        <Tooltip content="Du kan når som helst endre samtykket ved å kontakte oss på abakus@abakus.no">
          <ConsentStatus
            useConsent={useConsent}
            hasEnded={hasEnded}
            photoConsent={registration.photoConsent}
          />
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
