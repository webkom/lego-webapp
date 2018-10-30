import { compose } from 'redux';
import { connect } from 'react-redux';

import { selectPinned } from 'app/reducers/pinned';
import { fetchPinned, addPinned } from 'app/actions/PinnedAction';
import prepare from 'app/utils/prepare';
import PinnedEditor from './components/PinnedEditor';

const mapStateToProps = (state, props) => {
  return {
    pinned: selectPinned(state),
    actionGrant: state.pinned.actionGrant,
    initialValues: {}
  };
};

const mapDispachToProps = {
  handleSubmitCallback: addPinned
};

export default compose(
  prepare((props, dispatch) => dispatch(fetchPinned())),
  connect(mapStateToProps, mapDispachToProps)
)(PinnedEditor);
