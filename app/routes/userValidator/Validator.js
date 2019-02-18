// @flow

import * as React from 'react';
import cx from 'classnames';
import SearchPage from 'app/components/Search/SearchPage';
import type { SearchResult } from 'app/reducers/search';
import styles from './Validator.css';
import { Content } from 'app/components/Content';

// $FlowFixMe
import goodSound from '../../assets/good-sound.mp3';
type State = {
  showCompleted: boolean
};
type Props = {
  clearSearch: () => void,
  location: Object,
  onQueryChanged: string => void,
  results: Array<SearchResult>,
  searching: boolean
};

class Validator extends React.Component<Props, State> {
  input: ?HTMLInputElement;
  state = {
    showCompleted: false
  };

  showCompleted = () => {
    this.setState({ showCompleted: true });
    setTimeout(() => this.setState({ showCompleted: false }), 2000);
  };

  handleSelect = (result: SearchResult) => {
    this.props.clearSearch();
    const sound = new window.Audio(goodSound);
    sound.play();
    this.showCompleted();
    if (this.input) {
      this.input.focus();
    }
    return Promise.resolve();
  };

  render() {
    return (
      <Content>
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
          <i className="fa fa-check" />
        </div>
        <SearchPage
          {...this.props}
          placeholder="Skriv inn brukernavn eller navn"
          handleSelect={this.handleSelect}
          inputRef={input => {
            this.input = input;
          }}
        />
      </Content>
    );
  }
}

export default Validator;
