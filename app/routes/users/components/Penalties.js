// @flow

import React from 'react';
import { FormatTime } from 'app/components/Time';

type Penalty = {
  id: number,
  reason: string,
  weight: number,
  exactExpiration: string
};

type Props = {
  penalties: Array<Penalty>
};

function Penalties({ penalties }: Props) {
  if (!penalties.length) {
    return <div>Ingen prikker.</div>;
  }

  return (
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
  );
}

export default Penalties;
