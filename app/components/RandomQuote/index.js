// @flow
import { compose } from 'redux';
import prepare from 'app/utils/prepare';
import { fetchRandomQuote } from 'app/actions/QuoteActions';
import { connect } from 'react-redux';
import RandomQuote from './RandomQuote';
import { addReaction, deleteReaction } from 'app/actions/ReactionActions';
import { selectEmojis } from 'app/reducers/emojis';
import { selectRandomQuote } from 'app/reducers/randomQuote';
import { fetchEmojis } from 'app/actions/EmojiActions';
import loadingIndicator from 'app/utils/loadingIndicator';

function mapStateToProps(state, props) {
  const emojis = selectEmojis(state);
  const currentQuote = selectRandomQuote(state);
  return {
    loggedIn: props.loggedIn,
    emojis,
    fetchingEmojis: state.emojis.fetching,
    fetching: state.quotes.fetching,
    currentQuote
  };
}

const mapDispatchToProps = {
  fetchRandomQuote,
  addReaction,
  deleteReaction,
  fetchEmojis
};

export default compose(
  prepare((props, dispatch) =>
    Promise.all([dispatch(fetchRandomQuote()), dispatch(fetchEmojis())])
  ),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  loadingIndicator(['currentQuote.id'])
)(RandomQuote);
