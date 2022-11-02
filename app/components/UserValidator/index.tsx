import { useCallback, useEffect, useRef, useState } from 'react';
import { get } from 'lodash';
import cx from 'classnames';
import SearchPage from 'app/components/Search/SearchPage';
import type { SearchResult } from 'app/reducers/search';
import styles from './Validator.css';
import goodSound from 'app/assets/good-sound.mp3';
import Button from 'app/components/Button';
import Modal from 'app/components/Modal';
import { QrReader } from 'react-qr-reader';
import Icon from 'app/components/Icon';
type Props = {
  clearSearch: () => void;
  handleSelect: (arg0: SearchResult) => Promise<void>;
  location: Record<string, any>;
  onQueryChanged: (arg0: string) => void;
  results: Array<SearchResult>;
  searching: boolean;
};

const Validator = (props: Props) => {
  const { clearSearch, handleSelect } = props;
  const input = useRef<HTMLInputElement | null | undefined>(null);
  const [completed, setCompleted] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scannerResult, setScannerResult] = useState('');

  const showCompleted = () => {
    setCompleted(true);
    setTimeout(() => setCompleted(false), 2000);
  };

  const onSelect = useCallback(
    (result: SearchResult) => {
      clearSearch();
      return handleSelect(result)
        .then(
          () => {
            const sound = new window.Audio(goodSound);
            sound.play();
            showCompleted();
          },
          (err) => {
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
          if (input?.current) {
            input.current.focus();
          }
        });
    },
    [clearSearch, handleSelect]
  );
  useEffect(() => {
    if (scannerResult.length > 0 && !completed) {
      onSelect({
        username: scannerResult,
        result: '',
        color: '',
        content: '',
        icon: '',
        label: '',
        link: '',
        path: '',
        picture: '',
        value: '',
      });
    }
  }, [completed, onSelect, scannerResult]);
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
            if (res) {
              setScannerResult(res.getText());
            }

            if (error) {
              console.info(error);
            }

            setScannerResult('');
          }}
          constraints={{
            facingMode: 'environment',
          }}
        />
      </Modal>
      <Button
        className={styles.scannerButton}
        onClick={() => setShowScanner(true)}
      >
        <Icon className={styles.qrIcon} name="qr-code" size={18} />
        Vis scanner
      </Button>
      <SearchPage
        {...props}
        placeholder="Skriv inn brukernavn eller navn"
        handleSelect={onSelect}
        inputRef={input}
      />
    </>
  );
};

export default Validator;
