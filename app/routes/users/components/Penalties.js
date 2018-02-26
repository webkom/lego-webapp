// @flow

import React from 'react';
import { FormatTime } from 'app/components/Time';
//import Button from 'app/components/Button';
import PenaltyForm from './PenaltyForm';
import type { AddPenalty } from 'app/models';

type Penalty = {
  id: number,
  reason: string,
  weight: number,
  exactExpiration: string
};

type Props = {
  penalties: Array<Penalty>,
  addPenalty: AddPenalty => void,
  username: string,
  userId: number
};

function Penalties({ penalties, addPenalty, username, userId }: Props) {
  return (
    <div>
      {penalties.length ? (
        <ul>
          {penalties.map(penalty => {
            const word = penalty.weight > 1 ? 'prikker' : 'prikk';
            return (
              <li key={penalty.id} style={{ marginBottom: '10px' }}>
                <div>
                  <strong>
                    Har {penalty.weight} {word}
                  </strong>
                </div>
                <div>
                  Begrunnelse: <i>{penalty.reason}</i>
                </div>
                <div>
                  Utgår:{' '}
                  <i>
                    <FormatTime time={penalty.exactExpiration} />
                  </i>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <i>Ingen Prikker</i>
      )}
      <PenaltyForm user={userId} />
    </div>
  );
}

export default Penalties;
