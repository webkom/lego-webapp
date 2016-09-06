import { arrayOf } from 'normalizr';
import { quoteSchema } from 'app/reducers';
<<<<<<< Updated upstream
import { Quote } from './ActionTypes';
import { callAPI } from '../utils/http';
import { push } from 'react-router-redux';
import { startSubmit, stopSubmit } from 'redux-form';
=======
import { callAPI } from '../utils/http';
import { Joblistings } from './ActionTypes';
>>>>>>> Stashed changes

export function fetchAll({ approved = true }) {
  return callAPI({
    types: [
      Joblistings.FETCH_BEGIN,
      Joblistings.FETCH_SUCCESS,
      Joblistings.FETCH_FAILURE
    ],
<<<<<<< Updated upstream
    endpoint: `/joblistings/`,
=======
    endpoint: 'joblistings',
>>>>>>> Stashed changes
    schema: arrayOf(quoteSchema)
  });
}
