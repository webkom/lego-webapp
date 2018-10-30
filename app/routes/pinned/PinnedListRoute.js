import { compose } from 'redux';
import { connect } from 'react-redux';

import { selectPinned } from 'app/reducers/pinned';
import { fetchPinned } from 'app/actions/PinnedAction';
import prepare from 'app/utils/prepare';
import PinnedList from './components/PinnedList';
import { selectUserById } from 'app/reducers/users';
import { selectEventById } from 'app/reducers/events';
import { selectArticleById } from 'app/reducers/articles';

const mapStateToProps = (state, props) => {
  return {
    pins: selectPinned(state).map(pin => ({
      ...pin,
      author: selectUserById(state, { userId: pin.author }),
      event: pin.event && selectEventById(state, { eventId: pin.event }),
      article:
        pin.article && selectArticleById(state, { articleId: pin.article })
    })),
    actionGrant: state.pinned.actionGrant
  };
};

export default compose(
  prepare((props, dispatch) => dispatch(fetchPinned())),
  connect(mapStateToProps, null)
)(PinnedList);
