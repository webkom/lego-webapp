import React, { Component } from 'react';
import styles from './RandomQuote.css';
import { fetchRandomQuote } from 'app/actions/QuoteActions';
import { connect } from 'react-redux';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import { compose } from 'redux';

type Props = {
  fetchRandomQuote: () => void,
  loggedIn: boolean
};

class RandomQuote extends Component {
  props: Props;

  state = {
    currentQuote: {}
  };

  componentDidMount() {
    if (this.props.loggedIn) this.refreshQuote();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.loggedIn) this.refreshQuote();
  }

  refreshQuote = () => {
    this.props.fetchRandomQuote().then(action => {
      this.setState({
        currentQuote: action.payload.entities.quotes[action.payload.result]
      });
    });
  };

  render() {
    const { currentQuote } = this.state;

    return (
      <div>
        <h2 className={styles.heading}>
          <span>Tilfelding sitat</span>
          {this.props.loggedIn &&
            <i onClick={this.refreshQuote} className="fa fa-refresh" />}
        </h2>
        {this.props.loggedIn
          ? <div>
              <div className={styles.quoteText}>{currentQuote.text}</div>
              <div className={styles.quoteSource}>-{currentQuote.source}</div>
            </div>
          : 'Logg inn for å se sitater.'}
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    loggedIn: state.auth.token !== null
  };
}

const mapDispatchToProps = { fetchRandomQuote };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['loggedIn'], () => null)
)(RandomQuote);
