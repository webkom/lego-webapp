import { compose } from 'redux';
import { setStatusCode } from 'app/reducers/routing';
import HTTPError from 'app/routes/errors';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';

export default compose(
  withPreparedDispatch('setNotFoundStatusCode', (props, dispatch) =>
    dispatch(setStatusCode(404))
  )
)(HTTPError);
