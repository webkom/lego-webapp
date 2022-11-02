import { compose } from 'redux';
import { fetchRandomQuote } from 'app/actions/QuoteActions';
import { connect } from 'react-redux';
import RandomQuote from './RandomQuote';
import { addReaction, deleteReaction } from 'app/actions/ReactionActions';
import { selectEmojis } from 'app/reducers/emojis';
import { selectRandomQuote } from 'app/reducers/quotes';
import { fetchEmojis } from 'app/actions/EmojiActions';
import loadingIndicator from 'app/utils/loadingIndicator';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';

function mapStateToProps(state, props) {
  const emojis = selectEmojis(state);
  const currentQuote = selectRandomQuote(state);
  return {
    loggedIn: props.loggedIn,
    emojis,
    fetchingEmojis: state.emojis.fetching,
    fetching: state.quotes.fetching,
    currentQuote,
  };
}

const mapDispatchToProps = {
  fetchRandomQuote,
  addReaction,
  deleteReaction,
  fetchEmojis,
};

const LoginToSeeQuotes = () => <div>Logg inn for å se sitater.</div>;

export default compose(
  replaceUnlessLoggedIn(LoginToSeeQuotes),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['currentQuote.id'])
)(RandomQuote);
