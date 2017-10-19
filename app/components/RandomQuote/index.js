// @flow

import React, { Component } from 'react';
import styles from './RandomQuote.css';
import { fetchRandomQuote } from 'app/actions/QuoteActions';
import { connect } from 'react-redux';

type Props = {
  fetchRandomQuote: () => Promise<Object>,
  loggedIn: boolean
};

class RandomQuote extends Component {
  props: Props;

  state = {
    currentQuote: {}
  };

  _isMounted = false;

  componentDidMount() {
    this._isMounted = true;
    if (this.props.loggedIn) this.refreshQuote();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentWillReceiveProps(newProps) {
    if (newProps.loggedIn) this.refreshQuote();
  }

  refreshQuote = () => {
    this.props.fetchRandomQuote().then(action => {
      if (this._isMounted && action.payload) {
        this.setState({
          currentQuote: action.payload.entities.quotes[action.payload.result]
        });
      }
    });
  };

  render() {
    const { currentQuote } = this.state;

    return (
      <div>
        <h2 className={styles.heading}>
          {this.props.loggedIn && (
            <a onClick={this.refreshQuote} className={styles.title}>
              <i className="fa fa-refresh" />
              <span>Tilfeldig sitat</span>
            </a>
          )}
        </h2>
        {this.props.loggedIn ? (
          <div>
            <div className={styles.quoteText}>{currentQuote.text}</div>
            <div className={styles.quoteSource}>-{currentQuote.source}</div>
          </div>
        ) : (
          'Logg inn for å se sitater.'
        )}
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    loggedIn: props.loggedIn
  };
}

const mapDispatchToProps = { fetchRandomQuote };

export default connect(mapStateToProps, mapDispatchToProps)(RandomQuote);
