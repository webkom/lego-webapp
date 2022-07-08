//@flow
import { compose } from 'redux';

import { setStatusCode } from 'app/actions/RoutingActions';
import HTTPError from 'app/routes/errors';
import prepare from 'app/utils/prepare';

const statusCodePage = (statusCode: number) =>
  compose(prepare((props, dispatch) => dispatch(setStatusCode(statusCode))))(
    HTTPError
  );

export default statusCodePage;
