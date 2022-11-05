import { compose } from 'redux';
import HTTPError from 'app/routes/errors';
import { setStatusCode } from 'app/actions/RoutingActions';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';

const statusCodePage = (statusCode: number) =>
  compose(
    withPreparedDispatch('setStatusCode', (props, dispatch) =>
      dispatch(setStatusCode(statusCode))
    )
  )(HTTPError);

export default statusCodePage;
