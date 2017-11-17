// @flow

import * as React from 'react';
import _ from 'lodash';
import cx from 'classnames';
import SearchPage from 'app/components/Search/SearchPage';
import type { SearchResult } from 'app/reducers/search';
import styles from './Abacard.css';

// $FlowFixMe
import goodSound from '../../../../assets/good-sound.mp3';

type State = {
  showCompleted: boolean
};

class Abacard extends React.Component<*, State> {
  state = {
    showCompleted: false
  };

  showCompleted = () => {
    this.setState({ showCompleted: true });
    setTimeout(() => this.setState({ showCompleted: false }), 2000);
  };

  handleSelect = (result: SearchResult) => {
    this.props.handleSelect(result).then(
      () => {
        const sound = new window.Audio(goodSound);
        sound.play();
        this.showCompleted();
        return this.props.clearSearch();
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
    );
  };

  render() {
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
          <i className="fa fa-check" />
        </div>
        <SearchPage {...this.props} handleSelect={this.handleSelect} />
      </div>
    );
  }
}

export default Abacard;
