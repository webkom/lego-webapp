import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetch } from 'app/actions/TagActions';
import loadingIndicator from 'app/utils/loadingIndicator';
import prepare from 'app/utils/prepare';
import { push } from 'connected-react-router';
import TagDetail from './components/TagDetail';
import { selectTagById } from 'app/reducers/tags';

function mapStateToProps(state, props) {
  const { tagId } = props.params;

  return {
    tag: selectTagById(state, { tagId })
  };
}

const mapDispatchToProps = { push, fetch };

export default compose(
  prepare(({ params }, dispatch) => dispatch(fetch(params.tagId))),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  loadingIndicator(['tag.tag'])
)(TagDetail);
