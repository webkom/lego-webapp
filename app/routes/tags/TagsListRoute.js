// @flow
import { connect } from 'react-redux';
import { compose } from 'redux';

import { fetchAll } from 'app/actions/TagActions';
import { selectTags } from 'app/reducers/tags';
import prepare from 'app/utils/prepare';
import TagCloud from './components/TagCloud.js';

const mapStateToProps = (state) => ({
  tags: selectTags(state),
  fetching: state.tags.fetching,
  hasMore: state.tags.hasMore,
});

const mapDispatchToProps = { fetchAll };

export default compose(
  prepare((props, dispatch) => dispatch(fetchAll())),
  connect(mapStateToProps, mapDispatchToProps)
)(TagCloud);
