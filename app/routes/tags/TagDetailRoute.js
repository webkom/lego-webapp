import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose } from 'redux';

import { fetch } from 'app/actions/TagActions';
import { selectTagById } from 'app/reducers/tags';
import loadingIndicator from 'app/utils/loadingIndicator';
import prepare from 'app/utils/prepare';
import TagDetail from './components/TagDetail';

function mapStateToProps(state, props) {
  const { tagId } = props.match.params;

  return {
    tag: selectTagById(state, { tagId }),
  };
}

const mapDispatchToProps = { push, fetch };

export default compose(
  prepare(({ match: { params } }, dispatch) => dispatch(fetch(params.tagId))),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['tag.tag'])
)(TagDetail);
