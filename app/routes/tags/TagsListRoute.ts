import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchAll } from 'app/actions/TagActions';
import TagCloud from './components/TagCloud';
import { selectTags } from 'app/reducers/tags';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';

const mapStateToProps = (state) => ({
  tags: selectTags(state),
  fetching: state.tags.fetching,
  hasMore: state.tags.hasMore,
});

const mapDispatchToProps = {
  fetchAll,
};
export default compose(
  withPreparedDispatch('fetchTagsList', (props, dispatch) =>
    dispatch(fetchAll())
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(TagCloud);
