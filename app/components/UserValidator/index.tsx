import { Button, Flex, Icon, Modal } from '@webkom/lego-bricks';
import { get, debounce } from 'lodash';
import { useCallback, useRef, useState, type ComponentProps } from 'react';
import { QrReader } from 'react-qr-reader';
import { useNavigate, useParams } from 'react-router-dom';
import { autocomplete } from 'app/actions/SearchActions';
import { addToast } from 'app/actions/ToastActions';
import goodSound from 'app/assets/good-sound.mp3';
import SearchPage from 'app/components/Search/SearchPage';
import {
  selectAutocompleteRedux,
  type UserSearchResult,
} from 'app/reducers/search';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import styles from './Validator.css';
import type { SearchUser } from 'app/store/models/User';
import type { Required } from 'utility-types';

type UserWithUsername = Required<Partial<UserSearchResult>, 'username'>;

type Res = {
  payload: unknown;
};

type ScanResult = {
  message: string;
  count: number;
};

type Props = Omit<
  ComponentProps<typeof SearchPage<UserSearchResult>>,
  'handleSelect'
> & {
  handleSelect: (arg0: UserWithUsername) => Promise<SearchUser | Res>;
  validateAbakusGroup: boolean;
};

const isUser = (user: SearchUser | Res): user is SearchUser => {
  return 'username' in user;
};

const Validator = ({ handleSelect, validateAbakusGroup }: Props) => {
  const input = useRef<HTMLInputElement | null | undefined>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);

  const { eventId } = useParams<{ eventId: string }>();
  const results = useAppSelector((state) => selectAutocompleteRedux(state));

  const showSuccessModal = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 2000);
  };

  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const url = `/events/${eventId}/administrate/abacard?q=`;

  const clearSearch = useCallback(() => {
    navigate(url);
  }, [navigate, url]);

  const onQueryChanged = debounce((query) => {
    navigate(url + query);

    if (query) {
      dispatch(autocomplete(query, ['users.user']));
    }
  }, 300);

  /**
   * Add new scan result to the start of the array if not duplicate of most recent result,
   * if not increase the count
   *
   * @param {string} result The newest scan
   * @returns void
   */
  const addScanResult = (result: string) => {
    setScanResults((prevScanResults) => {
      if (
        prevScanResults.length !== 0 &&
        prevScanResults[0].message === result
      ) {
        prevScanResults[0].count++;
        return prevScanResults;
      }
      return [{ message: result, count: 1 }, ...prevScanResults].slice(0, 5);
    });
  };

  /**
   * Display search results depending on the current view
   *
   * @param {string}  result          The result from the API call
   * @param {boolean} [success=false] Whether the API call was fetched successfully or not
   * @returns void
   */
  const displayResult = useCallback(
    (result: string, success = false) => {
      if (showScanner) {
        addScanResult(result);
        return;
      }
      if (success) {
        showSuccessModal(result);
      } else {
        dispatch(addToast({ message: result }));
      }
    },
    [showScanner, dispatch]
  );

  /**
   * Handle selection/scan of user and process the result
   */
  const onSelect = useCallback(
    ({ username }: UserWithUsername) => {
      clearSearch();
      setIsLoading(true);
      return handleSelect({ username })
        .then(
          (user) => {
            setIsLoading(false);
            if (!validateAbakusGroup || (isUser(user) && user.isAbakusMember)) {
              const sound = new window.Audio(goodSound);
              sound.play();
              if (validateAbakusGroup) {
                displayResult(`${username} er Abakus-medlem`, true);
              } else {
                displayResult(`${username} ble registrert`, true);
              }
            } else {
              displayResult(`${username} er ikke medlem av Abakus!`);
            }
          },
          (err) => {
            setIsLoading(false);
            const payload = get(err, 'payload.response.jsonData');
            if (payload && payload.errorCode === 'not_registered') {
              displayResult(`${username} er ikke påmeldt arrangementet`);
            } else if (payload && payload.errorCode === 'already_present') {
              displayResult(`${username} er allerede registrert`);
            } else if (payload && payload.detail === 'Not found.') {
              displayResult(`Brukeren finnes ikke!\nBrukernavn: ${username}`);
            } else {
              displayResult(
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
    [clearSearch, displayResult, handleSelect, validateAbakusGroup]
  );

  const handleScannerResult = (scannerResult: string) => {
    if (scannerResult.length > 0 && !isLoading && !successMessage) {
      onSelect({ username: scannerResult });
    }
  };

  return (
    <>
      <Modal
        show={successMessage !== null}
        onHide={() => setSuccessMessage(null)}
      >
        <Flex
          alignItems="center"
          column
          justifyContent="center"
          padding={'2rem 0'}
        >
          <h3>{successMessage}</h3>
          <Icon name="checkmark" success size={160} />
        </Flex>
      </Modal>
      <Modal
        contentClassName={styles.scannerModal}
        show={showScanner}
        onHide={() => {
          setShowScanner(false);
          setScanResults([]);
        }}
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
        <h3>Nylig scannede ABA-IDer</h3>
        <Flex column justifyContent="center" gap={5}>
          {scanResults.map(({ message, count }) => (
            <span key={message + count}>
              {message} (x{count})
            </span>
          ))}
          {scanResults.length === 0 && (
            <span className="secondaryFontColor">
              De 5 siste ABA-IDene du scanner vises her
            </span>
          )}
        </Flex>
      </Modal>
      <Button
        className={styles.scannerButton}
        onClick={() => setShowScanner(true)}
      >
        <Icon className={styles.qrIcon} name="scan-outline" size={18} />
        Åpne scanner
      </Button>
      <SearchPage<UserSearchResult>
        onQueryChanged={onQueryChanged}
        results={results}
        placeholder="Skriv inn brukernavn eller navn"
        handleSelect={onSelect}
        inputRef={input}
      />
    </>
  );
};

export default Validator;
