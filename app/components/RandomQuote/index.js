import React, { Component } from 'react';
import styles from './RandomQuote.css';
import { fetchRandomQuote } from 'app/actions/QuoteActions';
import { connect } from 'react-redux';

type Props = {
  fetchRandomQuote: () => void
};

class RandomQuote extends Component {
  props: Props;

  state = {
    currentQuote: {}
  };

  componentDidMount() {
    this.refreshQuote();
  }

  refreshQuote = () => {
    this.props.fetchRandomQuote().then(action => {
      const payloadId = Object.keys(action.payload.entities.quotes)[0];
      this.setState({
        currentQuote: action.payload.entities.quotes[payloadId]
      });
    });
  };

  render() {
    const { currentQuote } = this.state;

    return (
      <div>
        <h2 className={styles.heading}>
          <span>Tilfelding sitat</span>
          <i
            onClick={this.refreshQuote}
            className="fa fa-refresh"
          />
        </h2>
        <div className={styles.quoteText}>{currentQuote.text}</div>
        <div className={styles.quoteSource}>-{currentQuote.source}</div>
      </div>
    );
  }
}

const mapDispatchToProps = { fetchRandomQuote };

export default connect(null, mapDispatchToProps)(RandomQuote);
