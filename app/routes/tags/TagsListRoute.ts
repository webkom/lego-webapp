import { compose } from "redux";
import { connect } from "react-redux";
import prepare from "app/utils/prepare";
import { fetchAll } from "app/actions/TagActions";
import TagCloud from "./components/TagCloud";
import { selectTags } from "app/reducers/tags";

const mapStateToProps = state => ({
  tags: selectTags(state),
  fetching: state.tags.fetching,
  hasMore: state.tags.hasMore
});

const mapDispatchToProps = {
  fetchAll
};
export default compose(prepare((props, dispatch) => dispatch(fetchAll())), connect(mapStateToProps, mapDispatchToProps))(TagCloud);