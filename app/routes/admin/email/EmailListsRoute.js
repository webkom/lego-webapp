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
  hasMore: state.emailLists.hasMore,
  notFetching: !state.emailLists.fetching || state.emailLists.items.length
});

const mapDispatchToProps = { fetch };

export default compose(
  prepare((props, dispatch) => dispatch(fetch())),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  loadingIndicator(['notFetching'])
)(EmailLists);
