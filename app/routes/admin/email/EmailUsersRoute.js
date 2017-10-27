// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import EmailUsers from './components/EmailUsers';
import { fetch } from 'app/actions/EmailUserActions';
import { selectEmailUsers } from 'app/reducers/emailUsers';
import prepare from 'app/utils/prepare';
import loadingIndicator from 'app/utils/loadingIndicator';

const mapStateToProps = state => ({
  emailUsers: selectEmailUsers(state),
  fetching: state.emailUsers.fetching,
  hasMore: state.emailUsers.hasMore
});

const mapDispatchToProps = { fetch };

export default compose(
  prepare((props, dispatch) => dispatch(fetch())),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['emailUsers.length'])
)(EmailUsers);
