// @flow

import React from 'react';

type Penalty = {
  id: number,
  reason: string,
  weight: number
};

type Props = {
  penalties: Array<Penalty>
};

function Penalties({ penalties }: Props) {
  if (!penalties.length) {
    return <div>Du har ingen prikker.</div>;
  }

  return (
    <ul>
      {penalties.map(penalty => {
        const word = penalty.weight > 1 ? 'prikker' : 'prikk';
        return (
          <li key={penalty.id}>
            <strong>
              {penalty.weight} {word}:{' '}
            </strong>
            {penalty.reason}
          </li>
        );
      })}
    </ul>
  );
}

export default Penalties;
