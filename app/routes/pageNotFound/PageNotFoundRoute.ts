import { compose } from 'redux';
import HTTPError from 'app/routes/errors';
import { setStatusCode } from 'app/store/slices/routerSlice';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';

export default compose(
  withPreparedDispatch('setNotFoundStatusCode', async (props, dispatch) =>
    dispatch(setStatusCode(404))
  )
)(HTTPError);
