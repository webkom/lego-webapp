import { compose } from 'redux';
import HTTPError from 'app/routes/errors';
import { setStatusCode } from 'app/actions/RoutingActions';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';

export default compose(
  withPreparedDispatch('setNotFoundStatusCode', (props, dispatch) =>
    dispatch(setStatusCode(404))
  )
)(HTTPError);
