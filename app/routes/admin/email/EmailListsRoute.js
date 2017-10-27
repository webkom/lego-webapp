// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import EmailLists from './components/EmailLists';
import { fetch } from 'app/actions/EmailListActions';
import { selectEmailLists } from 'app/reducers/emailLists';
import prepare from 'app/utils/prepare';
import loadingIndicator from 'app/utils/loadingIndicator';

const mapStateToProps = state => ({
  emailLists: selectEmailLists(state),
  fetching: state.emailLists.fetching,
  hasMore: state.emailLists.hasMore
});

const mapDispatchToProps = { fetch };

export default compose(
  prepare((props, dispatch) => dispatch(fetch())),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['emailLists.length'])
)(EmailLists);
