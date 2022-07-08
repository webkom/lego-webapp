// @flow

import { Component } from 'react';
import { get } from 'lodash';

import Modal from 'app/components/Modal';
import { ConfirmModal } from 'app/components/Modal/ConfirmModal';
import Validator from 'app/components/UserValidator';
import type {
  Event,
  EventRegistration,
  EventRegistrationPhotoConsent,
} from 'app/models';
import type { SearchResult } from 'app/reducers/search';

import styles from './Abacard.css';

type State = {
  resolve: ?() => Promise<*>,
  username: string,
};
type Props = {
  registered: Array<EventRegistration>,
  event: Event,
  clearSearch: () => void,
  markUsernamePresent: (string, string) => Promise<*>,
  markUsernameConsent: (
    string,
    string,
    EventRegistrationPhotoConsent
  ) => Promise<*>,
  location: Object,
  onQueryChanged: (string) => void,
  results: Array<SearchResult>,
  searching: boolean,
};

class Abacard extends Component<Props, State> {
  state = { resolve: null, username: '' };
  render() {
    const {
      registered,
      event: { useConsent, id, registrationCount },
      markUsernamePresent,
      markUsernameConsent,
      ...validatorProps
    } = this.props;
    const registerCount = registered.filter(
      (reg) => reg.presence === 'PRESENT' && reg.pool
    ).length;

    const handleSelect = ({ username = '' }: { username?: string }) =>
      markUsernamePresent(id.toString(), username).then(async (result) => {
        const payload = get(result, 'payload.response.jsonData');
        if (payload && payload.error) return result;

        if (useConsent) {
          return new Promise((resolve) =>
            this.setState({
              username: username,
              resolve: () => Promise.resolve(resolve(payload)),
            })
          );
        }
        return result;
      });

    const { resolve, username } = this.state;
    return (
      <div>
        <Validator {...validatorProps} handleSelect={handleSelect} />
        <Modal show={!!resolve} onHide={() => {}}>
          <ConfirmModal
            onCancel={async () => {
              if (!resolve) return Promise.resolve();
              try {
                await markUsernameConsent(
                  id.toString(),
                  username,
                  'PHOTO_NOT_CONSENT'
                );
              } catch (payload) {
                alert(`Det oppsto en uventet feil: ${JSON.stringify(payload)}`);
                this.setState({ resolve: null, username: '' });
                return;
              }

              await resolve();
              this.setState({ resolve: null, username: '' });
            }}
            onConfirm={async () => {
              if (!resolve) return Promise.resolve();
              try {
                await markUsernameConsent(
                  id.toString(),
                  username,
                  'PHOTO_CONSENT'
                );
              } catch (payload) {
                alert(`Det oppsto en uventet feil: ${JSON.stringify(payload)}`);
                this.setState({ resolve: null, username: '' });
                return;
              }

              await resolve();
              this.setState({ resolve: null, username: '' });
            }}
            title="Jeg samtykker til at det kan tas bilder av meg ved dette arrangementet, og til at disse kan publiseres på Abakus.no."
            message="Du kan til enhver tid trekke tilbake samtykket."
            confirmText="Ja, jeg samtykker"
            cancelText="NEI, jeg samtykker ikke"
          />
        </Modal>
        <div className={styles.counter}>
          {registerCount}/{registrationCount} har møtt opp
        </div>
      </div>
    );
  }
}

export default Abacard;
