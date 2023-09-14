import { connect } from 'react-redux';
import { compose } from 'redux';
import { push } from 'redux-first-history';
import { fetch } from 'app/actions/TagActions';
import { selectTagById } from 'app/reducers/tags';
import loadingIndicator from 'app/utils/loadingIndicator';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import TagDetail from './components/TagDetail';

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
