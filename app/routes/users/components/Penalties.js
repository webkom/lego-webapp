// @flow

import React from 'react';
import moment from 'moment-timezone';
import Time, { FormatTime } from 'app/components/Time';



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
          <li key={penalty.id} style={{paddingBottom: "10px"}}>
            <strong>
              Du har fått {penalty.weight} {word}
            </strong>
            <br/>
            Begrunnelse: <i>{penalty.reason}</i>
            <br/>
            Utgår: <i><FormatTime time={moment(penalty.exactExpiration)}/></i>

          </li>
        );
      })}
    </ul>
  );
}

export default Penalties;
