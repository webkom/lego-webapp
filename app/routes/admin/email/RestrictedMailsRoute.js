// @flow

import { connect } from 'react-redux';
import { compose } from 'redux';

import { fetch } from 'app/actions/RestrictedMailActions';
import { selectRestrictedMails } from 'app/reducers/restrictedMails';
import prepare from 'app/utils/prepare';
import RestrictedMails from './components/RestrictedMails';

const mapStateToProps = (state) => ({
  restrictedMails: selectRestrictedMails(state),
  fetching: state.restrictedMails.fetching,
  hasMore: state.restrictedMails.hasMore,
});

const mapDispatchToProps = { fetch };

export default compose(
  prepare((props, dispatch) => dispatch(fetch())),
  connect(mapStateToProps, mapDispatchToProps)
)(RestrictedMails);
