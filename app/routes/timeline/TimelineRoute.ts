import { compose } from "redux";
import { connect } from "react-redux";
import prepare from "app/utils/prepare";
import TimelinePage from "./components/TimelinePage";
import replaceUnlessLoggedIn from "app/utils/replaceUnlessLoggedIn";
import { LoginPage } from "app/components/LoginForm";
import { fetchPersonalFeed } from "app/actions/FeedActions";
import { selectFeedById, selectFeedActivitesByFeedId } from "app/reducers/feeds";

const loadData = (props, dispatch) => {
  return dispatch(fetchPersonalFeed());
};

const mapStateToProps = (state: Record<string, any>) => ({
  feed: selectFeedById(state, {
    feedId: 'personal'
  }),
  feedItems: selectFeedActivitesByFeedId(state, {
    feedId: 'personal'
  })
});

export default compose(replaceUnlessLoggedIn(LoginPage), prepare(loadData), // $FlowFixMe
connect(mapStateToProps))(TimelinePage);