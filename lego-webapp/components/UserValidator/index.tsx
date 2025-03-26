import { Button, Flex, Icon, Modal } from '@webkom/lego-bricks';
import { get, debounce } from 'lodash-es';
import { Check, ScanQrCode, X } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { navigate } from 'vike/client/router';
import goodSound from '~/assets/sounds/good-sound.mp3';
import SearchPage from '~/components/Search/SearchPage';
import TextWithIcon from '~/components/TextWithIcon';
import { addToast } from '~/components/Toast/ToastProvider';
import { autocomplete } from '~/redux/actions/SearchActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import {
  selectAutocompleteRedux,
  type UserSearchResult,
} from '~/redux/slices/search';
import { useParams } from '~/utils/useParams';
import styles from './Validator.module.css';
import type { ReactNode } from 'react';
import type { Required } from 'utility-types';
import type { SearchUser } from '~/redux/models/User';

type UserWithUsername = Required<Partial<UserSearchResult>, 'username'>;

type Res = {
  payload: unknown;
};

type ScanResult = {
  message: string;
  icon: ReactNode;
  color: string;
  count?: number;
};

type Props = {
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

  const url = `/events/${eventId}/administrate/abacard?q=`;

  const clearSearch = useCallback(() => {
    navigate(url);
  }, [url]);

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
  const addScanResult = (result: ScanResult) => {
    setScanResults((prevScanResults) => {
      if (
        prevScanResults.length !== 0 &&
        prevScanResults[0].message === result.message
      ) {
        prevScanResults[0].count = (prevScanResults[0].count ?? 1) + 1;
        return prevScanResults;
      }
      return [
        { ...result, count: result.count ?? 1 },
        ...prevScanResults,
      ].slice(0, 5);
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
    (result: ScanResult, success = false) => {
      if (showScanner) {
        addScanResult(result);
        return;
      }
      if (success) {
        showSuccessModal(result.message);
      } else {
        addToast({ message: result.message });
      }
    },
    [showScanner],
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

              displayResult(
                {
                  message: validateAbakusGroup
                    ? `${username} er Abakus-medlem`
                    : `${username} ble registrert`,
                  icon: <Check />,
                  color: 'var(--success-color)',
                },
                true,
              );
            } else {
              displayResult(
                {
                  message: `${username} er ikke medlem av Abakus`,
                  icon: <X />,
                  color: 'var(--danger-color)',
                },
                false,
              );
            }
          },
          (err) => {
            setIsLoading(false);
            const payload = get(err, 'payload.response.jsonData');

            const errorMessages = {
              not_registered: `${username} er ikke påmeldt arrangementet`,
              already_present: `${username} er allerede registrert`,
              unregistered: `${username} har meldt seg av`,
              not_properly_registered: `${username} sin påmelding er i limbo. Ta kontakt med Webkom`,
              waitlisted: `${username} er på venteliste`,
              late_or_absent: `${username} har blitt registrert som ikke tilstede`,
              missing_payment: `${username} har ikke betalt`,
              no_user: `Brukeren finnes ikke! Brukernavn: ${username}`,
            };

            const errorMessage =
              payload && payload.errorCode in errorMessages
                ? errorMessages[payload.errorCode]
                : `Det oppsto en uventet feil: ${JSON.stringify(payload || err)}`;

            displayResult(
              {
                message: errorMessage,
                icon: <X />,
                color: 'var(--danger-color)',
              },
              false,
            );
          },
        )
        .then(() => {
          if (input?.current) {
            input.current.focus();
          }
        });
    },
    [clearSearch, displayResult, handleSelect, validateAbakusGroup],
  );

  const handleScannerResult = (scannerResult: string) => {
    if (scannerResult.length > 0 && !isLoading && !successMessage) {
      onSelect({ username: scannerResult });
    }
  };

  return (
    <>
      <Modal
        isOpen={successMessage !== null}
        onOpenChange={(open) => !open && setSuccessMessage(null)}
      >
        <Flex
          alignItems="center"
          column
          justifyContent="center"
          padding={'var(--spacing-xl) 0'}
        >
          <h3>{successMessage}</h3>
          <Icon name="checkmark" success size={160} />
        </Flex>
      </Modal>
      <Modal
        isOpen={showScanner}
        onOpenChange={(open) => {
          if (!open) {
            setShowScanner(false);
            setScanResults([]);
          }
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
          {scanResults.map(({ message, color, icon, count }) => (
            <div style={{ color }} key={message + count}>
              <TextWithIcon
                iconNode={icon}
                content={`${message} (x${count ?? 1})`}
              />
            </div>
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
        onPress={() => setShowScanner(true)}
      >
        <Icon iconNode={<ScanQrCode />} size={19} />
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
