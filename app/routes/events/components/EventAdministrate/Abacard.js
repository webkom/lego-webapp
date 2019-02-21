// @flow

import * as React from 'react';
import type { SearchResult } from 'app/reducers/search';
import styles from './Abacard.css';
import Validator from 'app/components/UserValidator';

// $FlowFixMe
import type { EventRegistration } from 'app/models';
type State = {
  showCompleted: boolean
};
type Props = {
  registered: Array<EventRegistration>,
  event: {
    totalCapacity: number
  },
  clearSearch: () => void,
  handleSelect: SearchResult => Promise<void>,
  location: Object,
  onQueryChanged: string => void,
  results: Array<SearchResult>,
  searching: boolean
};

class Abacard extends React.Component<Props, State> {
  render() {
    const {
      registered,
      event: { totalCapacity },
      ...validatorProps
    } = this.props;
    const registerCount = registered.filter(
      reg => reg.presence === 'PRESENT' && reg.pool
    ).length;

    return (
      <div>
        <Validator {...validatorProps} />
        <div className={styles.counter}>
          {registerCount}/{totalCapacity} har møtt opp
        </div>
      </div>
    );
  }
}

export default Abacard;
