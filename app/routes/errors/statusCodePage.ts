import { compose } from 'redux';
import HTTPError from 'app/routes/errors';
import { setStatusCode } from 'app/store/slices/routerSlice';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';

const statusCodePage = (statusCode: number) =>
  compose(
    withPreparedDispatch('setStatusCode', async (props, dispatch) =>
      dispatch(setStatusCode(statusCode))
    )
  )(HTTPError);

export default statusCodePage;
