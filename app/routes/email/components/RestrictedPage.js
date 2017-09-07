// @flow

import React from 'react';

import { FlexRow, FlexItem } from 'app/components/FlexBox';

type Props = {};

const RestricedPage = (props: Props) => {
  return (
    <div>
      <p>
        Begrenset e-post benyttes når man ønsker å sende en engangspost til en
        kombinasjon av grupper, brukere, eventer osv. Dette benyttes når det
        ikke allerede finnes en liste eller andresse på ønskede mottakere. Dette
        benyttes f.eks. ved utsending av ukesmail til alle våre medlemmer.
      </p>

      <FlexRow flexWrap="wrap">
        <FlexItem flex={1}>
          <p>Content</p>
        </FlexItem>
      </FlexRow>
    </div>
  );
};

export default RestricedPage;
