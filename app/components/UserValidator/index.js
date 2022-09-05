// @flow

import { useState } from 'react';
import { get } from 'lodash';
import cx from 'classnames';
import SearchPage from 'app/components/Search/SearchPage';
import type { SearchResult } from 'app/reducers/search';
import styles from './Validator.css';

// $FlowFixMe
import goodSound from 'app/assets/good-sound.mp3';
type Props = {
  clearSearch: () => void,
  handleSelect: (SearchResult) => Promise<void>,
  location: Object,
  onQueryChanged: (string) => void,
  results: Array<SearchResult>,
  searching: boolean,
};

const Validator = (props: Props) => {
  const [input, setInput] = useState<?HTMLInputElement>();
  const [completed, setCompleted] = useState(false);

  const showCompleted = () => {
    setCompleted(true);
    setTimeout(() => setCompleted(false), 2000);
  };

  const handleSelect = (result: SearchResult) => {
    props.clearSearch();
    return props
      .handleSelect(result)
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
        if (input) {
          input.focus();
        }
      });
  };

  return (
    <div>
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
      <SearchPage
        {...props}
        placeholder="Skriv inn brukernavn eller navn"
        handleSelect={handleSelect}
        inputRef={(inputEl) => {
          setInput(inputEl);
        }}
      />
    </div>
  );
};

export default Validator;
