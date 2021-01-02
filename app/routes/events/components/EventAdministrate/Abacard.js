// @flow

import { Component } from 'react';
import { get } from 'lodash';
import type { SearchResult } from 'app/reducers/search';
import styles from './Abacard.css';
import Validator from 'app/components/UserValidator';

import type { EventRegistration, Event } from 'app/models';
type State = {
  username: string,
};
type Props = {
  registered: Array<EventRegistration>,
  event: Event,
  clearSearch: () => void,
  markUsernamePresent: (string, string) => Promise<*>,
  location: Object,
  onQueryChanged: (string) => void,
  results: Array<SearchResult>,
  searching: boolean,
};

class Abacard extends Component<Props, State> {
  state = { username: '' };
  render() {
    const {
      registered,
      event: { id, registrationCount },
      markUsernamePresent,
      ...validatorProps
    } = this.props;
    const registerCount = registered.filter(
      (reg) => reg.presence === 'PRESENT' && reg.pool
    ).length;

    const handleSelect = ({ username = '' }: { username?: string }) =>
      markUsernamePresent(id.toString(), username).then(async (result) => {
        const payload = get(result, 'payload.response.jsonData');
        if (payload && payload.error) return result;
        return result;
      });

    return (
      <div>
        <Validator {...validatorProps} handleSelect={handleSelect} />
        <div className={styles.counter}>
          {registerCount}/{registrationCount} har møtt opp
        </div>
      </div>
    );
  }
}

export default Abacard;
