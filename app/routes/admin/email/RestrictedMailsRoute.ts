import { compose } from 'redux';
import { connect } from 'react-redux';
import RestrictedMails from './components/RestrictedMails';
import { fetch } from 'app/actions/RestrictedMailActions';
import { selectRestrictedMails } from 'app/store/slices/restrictedMailsSlice';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';

const mapStateToProps = (state) => ({
  restrictedMails: selectRestrictedMails(state),
  fetching: state.restrictedMails.fetching,
  hasMore: state.restrictedMails.hasMore,
});

const mapDispatchToProps = {
  fetch,
};
export default compose(
  withPreparedDispatch('fetchRestrictedMails', (props, dispatch) =>
    dispatch(fetch())
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(RestrictedMails);
