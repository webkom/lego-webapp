import cx from 'classnames';
import { get } from 'lodash';
import { useCallback, useRef, useState } from 'react';
import { QrReader } from 'react-qr-reader';
import goodSound from 'app/assets/good-sound.mp3';
import Button from 'app/components/Button';
import Icon from 'app/components/Icon';
import Modal from 'app/components/Modal';
import SearchPage from 'app/components/Search/SearchPage';
import type { User } from 'app/models';
import type { UserSearchResult } from 'app/reducers/search';
import styles from './Validator.module.css';
import type { ComponentProps } from 'react';
import type { Required } from 'utility-types';

type UserWithUsername = Required<Partial<UserSearchResult>, 'username'>;

type Res = {
  payload: unknown;
};

type Props = Omit<
  ComponentProps<typeof SearchPage<UserSearchResult>>,
  'handleSelect'
> & {
  clearSearch: () => void;
  handleSelect: (arg0: UserWithUsername) => Promise<User | Res>;
  onQueryChanged: (arg0: string) => void;
  results: Array<UserSearchResult>;
  searching: boolean;
  validateAbakusGroup: boolean;
};

const isUser = (user: User | Res): user is User => {
  return 'username' in user;
};

const Validator = (props: Props) => {
  const { clearSearch, handleSelect, validateAbakusGroup } = props;
  const input = useRef<HTMLInputElement | null | undefined>(null);
  const [completed, setCompleted] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const showCompleted = () => {
    setCompleted(true);
    setTimeout(() => setCompleted(false), 2000);
  };

  const onSelect = useCallback(
    (result: UserWithUsername) => {
      clearSearch();
      return handleSelect(result)
        .then(
          (user) => {
            if (!validateAbakusGroup || (isUser(user) && user.isAbakusMember)) {
              const sound = new window.Audio(goodSound);
              sound.play();
              showCompleted();
            } else {
              alert('Brukeren er ikke medlem av Abakus!');
            }
          },
          (err) => {
            const payload = get(err, 'payload.response.jsonData');
            if (payload && payload.errorCode === 'not_registered') {
              alert('Bruker er ikke påmeldt på eventet!');
            } else if (payload && payload.errorCode === 'already_present') {
              alert(payload.error);
            } else if (payload && payload.detail === 'Not found.') {
              alert(`Brukeren finnes ikke!\nBrukernavn: ${result.username}`);
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
    [clearSearch, handleSelect, validateAbakusGroup]
  );

  const handleScannerResult = (scannerResult: string) => {
    if (scannerResult.length > 0 && !completed) {
      onSelect({
        username: scannerResult,
      });
    }
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
        <Icon name="checkmark" success size={160} />
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
              handleScannerResult(res.getText());
            }

            if (error) {
              console.info(error);
            }
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
        Åpne scanner
      </Button>
      <SearchPage<UserSearchResult>
        {...props}
        placeholder="Skriv inn brukernavn eller navn"
        handleSelect={onSelect}
        inputRef={input}
      />
    </>
  );
};

export default Validator;
