// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import RestrictedMailListsPage from './components/RestrictedMailListsPage';
import { fetch } from 'app/actions/restrictedMailActions';
import { selectRestrictedMails } from 'app/reducers/restrictedMails';
import prepare from 'app/utils/prepare';

const mapStateToProps = state => ({
  restrictedMails: selectRestrictedMails(state),
  fetching: state.restrictedMails.fetching,
  hasMore: state.restrictedMails.hasMore
});

const mapDispatchToProps = { fetch };

export default compose(
  prepare((props, dispatch) => dispatch(fetch())),
  connect(mapStateToProps, mapDispatchToProps)
)(RestrictedMailListsPage);
