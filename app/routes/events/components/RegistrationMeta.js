// @flow

import React from 'react';
import { hasPaid } from '../utils';

type Props = {
  registration: Object,
  isPriced: boolean,
  registrationIndex?: Number
};

const RegistrationMeta = ({
  registration,
  isPriced,
  registrationIndex
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
        ) : registrationIndex !== undefined ? (
          <div>
            <i className="fa fa-pause-circle" /> Din plass i venteliste{' '}
            <strong>{registrationIndex + 1}</strong>
          </div>
        ) : (
          <div>
            <i className="fa fa-pause-circle" /> Du er i venteliste
          </div>
        )}
        {isPriced &&
          (hasPaid(registration.chargeStatus) ? (
            <div>
              <i className="fa fa-check-circle" /> Du har betalt
            </div>
          ) : (
            <div>
              <i className="fa fa-exclamation-circle" /> Du har ikke betalt
            </div>
          ))}
      </div>
    )}
  </div>
);

export default RegistrationMeta;
