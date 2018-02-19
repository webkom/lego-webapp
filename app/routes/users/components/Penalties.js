// @flow

import React from 'react';
import { FormatTime } from 'app/components/Time';
import Button from 'app/components/Button';

type Penalty = {
  id: number,
  reason: string,
  weight: number,
  exactExpiration: string
};

type Props = {
  penalties: Array<Penalty>,
  addPenalty: () => void,
  username: string
};

function Penalties({ penalties, addPenalty, username }: Props) {
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
          asd
          <Button>Fjern prikk</Button>
        </ul>
      ) : (
        <i>Ingen Prikker</i>
      )}
      <Button onClick={() => addPenalty(username)}>Lag prikk</Button>
    </div>
  );
}

export default Penalties;
