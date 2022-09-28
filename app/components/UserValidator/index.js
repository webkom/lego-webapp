// @flow

import { useState } from 'react';
import { get } from 'lodash';
import cx from 'classnames';
import SearchPage from 'app/components/Search/SearchPage';
import type { SearchResult } from 'app/reducers/search';
import styles from './Validator.css';

// $FlowFixMe
import goodSound from 'app/assets/good-sound.mp3';
import Button from 'app/components/Button';
import Modal from 'app/components/Modal';
import { QrReader } from 'react-qr-reader';
import Icon from 'app/components/Icon';
type Props = {
  clearSearch: () => void,
  handleSelect: (string) => Promise<void>,
  location: Object,
  onQueryChanged: (string) => void,
  results: Array<SearchResult>,
  searching: boolean,
};

const Validator = (props: Props) => {
  const [input, setInput] = useState<?HTMLInputElement>();
  const [completed, setCompleted] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [processing, setProcessing] = useState(false);

  const showCompleted = () => {
    setCompleted(true);
    setTimeout(() => setCompleted(false), 2000);
  };

  const handleSelect = (result: string) => {
    setProcessing(true);
    props.clearSearch();
    return props
      .handleSelect(result)
      .then(
        () => {
          const sound = new window.Audio(goodSound);
          sound.play();
          showCompleted();
          setProcessing(false);
        },
        (err) => {
          setProcessing(false);
          const payload = get(err, 'payload.response.jsonData');
          if (payload && payload.errorCode === 'not_registered') {
            alert('Bruker er ikke påmeldt på eventet!');
          } else if (payload && payload.errorCode === 'already_present') {
            alert(payload.error);
          } else {
            alert(
              `Det oppsto en uventet feil: ${JSON.stringify(payload || err)}`
            );
          }
        }
      )
      .then(() => {
        if (input) {
          input.focus();
        }
      });
  };

  return (
    <>
      <div
        className={cx(styles.overlay, {
          [styles.shown]: completed,
        })}
      >
        <h3>
          Tusen takk! Kos deg{' '}
          <span role="img" aria-label="smile">
            😀
          </span>
        </h3>
        <i className="fa fa-check" />
      </div>
      <Modal
        contentClassName={styles.scannerModal}
        show={showScanner}
        onHide={() => setShowScanner(false)}
      >
        <h1>Scan ABA-ID</h1>
        <QrReader
          onResult={(res, error) => {
            if (!processing && res) {
              handleSelect(res.getText());
            }
            if (error) {
              console.info(error);
            }
          }}
          constraints={{ facingMode: 'environment' }}
        />
      </Modal>
      <Button
        className={styles.scannerButton}
        onClick={() => setShowScanner(true)}
      >
        <Icon name="qr-code" size={18} />
        Vis scanner
      </Button>
      <SearchPage
        {...props}
        placeholder="Skriv inn brukernavn eller navn"
        handleSelect={handleSelect}
        inputRef={(inputEl) => {
          setInput(inputEl);
        }}
      />
    </>
  );
};

export default Validator;
