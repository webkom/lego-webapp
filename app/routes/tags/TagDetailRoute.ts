import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetch } from 'app/actions/TagActions';
import loadingIndicator from 'app/utils/loadingIndicator';
import { push } from 'connected-react-router';
import TagDetail from './components/TagDetail';
import { selectTagById } from 'app/store/slices/tagsSlice';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';

function mapStateToProps(state, props) {
  const { tagId } = props.match.params;
  return {
    tag: selectTagById(state, {
      tagId,
    }),
  };
}

const mapDispatchToProps = {
  push,
  fetch,
};
export default compose(
  withPreparedDispatch('fetchTagDetail', ({ match: { params } }, dispatch) =>
    dispatch(fetch(params.tagId))
  ),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['tag.tag'])
)(TagDetail);
