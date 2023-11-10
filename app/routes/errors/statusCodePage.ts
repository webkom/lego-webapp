import { compose } from 'redux';
import { setStatusCode } from 'app/actions/RoutingActions';
import HTTPError from 'app/routes/errors';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';

const statusCodePage = (statusCode: number) =>
  compose(
    withPreparedDispatch('setStatusCode', (props, dispatch) =>
      dispatch(setStatusCode(statusCode)),
    ),
  )(HTTPError);

export default statusCodePage;
