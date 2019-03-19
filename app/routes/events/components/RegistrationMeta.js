// @flow

import React from 'react';
import type { EventRegistrationChargeStatus } from 'app/models';
import {
  paymentPending,
  paymentCardDeclined,
  paymentSuccess,
  paymentManual,
  paymentCardExpired
} from '../utils';

type Props = {
  registration: Object,
  isPriced: boolean,
  registrationIndex: number,
  hasSimpleWaitingList: boolean
};
const PaymentStatus = ({
  chargeStatus
}: {
  chargeStatus: EventRegistrationChargeStatus
}) => {
  switch (chargeStatus) {
    case paymentPending:
      return (
        <>
          <i className="fa fa-exclamation-circle" /> Betaling pågår
        </>
      );
    case paymentManual:
    case paymentSuccess:
      return (
        <>
          <i className="fa fa-check-circle" /> Du har betalt
        </>
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
        <>
          <i className="fa fa-exclamation-circle" /> Du har ikke betalt. Kortet
          du prøvde å betale med har gått ut på dato.
        </>
      );
    default:
      return (
        <>
          <i className="fa fa-exclamation-circle" /> Du har ikke betalt
        </>
      );
  }
};

const RegistrationMeta = ({
  registration,
  isPriced,
  registrationIndex,
  hasSimpleWaitingList
}: Props) => (
  <div>
    {!registration && (
      <div>
        <i className="fa fa-exclamation-circle" /> Du er ikke registrert
      </div>
    )}
    {registration && (
      <div>
        {registration.pool ? (
          <div>
            <i className="fa fa-check-circle" /> Du er registrert
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
        {isPriced && (
          <div>
            <PaymentStatus chargeStatus={registration.chargeStatus} />
          </div>
        )}
      </div>
    )}
  </div>
);

export default RegistrationMeta;
