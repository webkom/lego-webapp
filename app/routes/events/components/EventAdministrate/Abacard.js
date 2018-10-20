// @flow

import * as React from 'react';
import _ from 'lodash';
import cx from 'classnames';
import SearchPage from 'app/components/Search/SearchPage';
import type { SearchResult } from 'app/reducers/search';
import styles from './Abacard.css';

// $FlowFixMe
import goodSound from '../../../../assets/good-sound.mp3';
import type { EventRegistration } from 'app/models';
type State = {
  showCompleted: boolean,
  lego: any
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
  input: ?HTMLInputElement;
  state = {
    showCompleted: false,
    lego: []
  };

  showCompleted = () => {
    this.setState({
      showCompleted: true,
      lego: new Array(50).fill(1).map((_, i) => (
        <img
          key={i}
          alt="lego"
          height="100"
          width="100"
          style={{
            left: `${i / 51 * 80 + Math.random() * 10}%`,
            top: `-${100 + Math.random() * 1000}px`,
            transform: `rotate(-${Math.random() * 100}deg)`
          }}
          className={styles.lego}
          src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Legobrick.png"
        />
      ))
    });
    setTimeout(() => this.setState({ showCompleted: false }), 2000);
    setTimeout(() => this.setState({ lego: [] }), 5000);
  };

  handleSelect = (result: SearchResult) => {
    this.props.clearSearch();
    return this.props
      .handleSelect(result)
      .then(
        () => {
          const sound = new window.Audio(goodSound);
          sound.play();
          this.showCompleted();
        },
        err => {
          const payload = _.get(err, 'payload.response.jsonData');
          if (payload && payload.errorCode === 'not_registered') {
            alert('Bruker er ikke påmeldt på eventet!');
          } else if (payload && payload.errorCode === 'already_present') {
            alert('Bruker er allerede satt som tilstede.');
          } else {
            alert(
              `Det oppsto en uventet feil: ${JSON.stringify(payload || err)}`
            );
          }
        }
      )
      .then(() => {
        if (this.input) {
          this.input.focus();
        }
      });
  };

  render() {
    const { registered, event: { totalCapacity } } = this.props;
    const registerCount = registered.filter(
      reg => reg.presence === 'PRESENT' && reg.pool
    ).length;

    return (
      <div>
        <div
          className={cx(styles.overlay, {
            [styles.shown]: this.state.showCompleted
          })}
        >
          <h3>
            Tusen takk! Kos deg{' '}
            <span role="img" aria-label="smile">
              😀
            </span>
          </h3>
          <img
            alt="lego"
            height="300"
            width="300"
            src="https://thumbor-staging.abakus.no/WTDtxYLjdzhA6LF6hAqAMqg1qhI=/400x400/abakus_webkom.png"
          />
        </div>
        <SearchPage
          {...this.props}
          placeholder="Skriv inn brukernavn eller navn"
          handleSelect={this.handleSelect}
          inputRef={input => {
            this.input = input;
          }}
        />
        <div className={styles.counter}>
          {registerCount}/{totalCapacity} har møtt opp
        </div>
        <div>{this.state.lego}</div>
      </div>
    );
  }
}

export default Abacard;
