// @flow

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
  hasOpened: boolean,
  hasEnded: boolean,
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
}: Props) => (
  <>
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
      </>
    )}
  </>
);

export default RegistrationMeta;
