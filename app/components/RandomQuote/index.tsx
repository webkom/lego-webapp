import { connect } from 'react-redux';
import { compose } from 'redux';
import { fetchRandomQuote } from 'app/actions/QuoteActions';
import { selectEmojis } from 'app/reducers/emojis';
import { selectRandomQuote } from 'app/reducers/quotes';
import loadingIndicator from 'app/utils/loadingIndicator';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import RandomQuote from './RandomQuote';

function mapStateToProps(state, props) {
  const emojis = selectEmojis(state);
  const currentQuote = selectRandomQuote(state);
  return {
    loggedIn: props.loggedIn,
    emojis,
    fetching: state.quotes.fetching,
    currentQuote,
  };
}

const mapDispatchToProps = {
  fetchRandomQuote,
};

const LoginToSeeQuotes = () => <div>Logg inn for å se sitater.</div>;

export default compose(
  replaceUnlessLoggedIn(LoginToSeeQuotes),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['currentQuote.id'])
)(RandomQuote);
