// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import RestrictedMails from './components/RestrictedMails';
import { fetch } from 'app/actions/RestrictedMailActions';
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
)(RestrictedMails);
