// @flow

import * as React from 'react';
import { get } from 'lodash';
import type { SearchResult } from 'app/reducers/search';
import { ConfirmModal } from 'app/components/Modal/ConfirmModal';
import styles from './Abacard.css';
import Modal from 'app/components/Modal';
import Validator from 'app/components/UserValidator';

// $FlowFixMe
import type { EventRegistration, Event } from 'app/models';
type State = {
  // Skra
  resolve: ?() => Promise<*>
};
type Props = {
  registered: Array<EventRegistration>,
  event: Event,
  clearSearch: () => void,
  markUsernamePresent: (string, string) => Promise<*>,
  location: Object,
  onQueryChanged: string => void,
  results: Array<SearchResult>,
  searching: boolean
};

class Abacard extends React.Component<Props, State> {
  state = { resolve: null };
  render() {
    const {
      registered,
      event: { totalCapacity, useConsent, id },
      markUsernamePresent,
      ...validatorProps
    } = this.props;
    const registerCount = registered.filter(
      reg => reg.presence === 'PRESENT' && reg.pool
    ).length;

    const handleSelect = ({ username }) =>
      markUsernamePresent(id.toString(), username).then(async result => {
        const payload = get(result, 'payload.response.jsonData');
        if (payload && payload.error) return result;

        if (useConsent || true) {
          return new Promise(resolve =>
            this.setState({ resolve: () => Promise.resolve(resolve(payload)) })
          );
        }
        return result;
      });

    const { resolve } = this.state;
    return (
      <div>
        <Validator {...validatorProps} handleSelect={handleSelect} />
        <Modal show={!!resolve}>
          <ConfirmModal
            onCancel={() => Promise.resolve()}
            onConfirm={() => {
              this.setState({ resolve: null });
              return resolve ? resolve() : Promise.resolve();
            }}
            message={'Hei'}
            title="hei"
            errorMessage="test"
          />
        </Modal>
        <div className={styles.counter}>
          {registerCount}/{totalCapacity} har møtt opp
        </div>
      </div>
    );
  }
}

export default Abacard;
