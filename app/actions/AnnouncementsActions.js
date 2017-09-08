// @flow

import callAPI from 'app/actions/callAPI';
import { Announcements } from './ActionTypes';
import { announcementsSchema } from 'app/reducers';

export function fetchAll() {
  return callAPI({
    types: Announcements.FETCH_ALL,
    endpoint: '/announcements/',
    schema: [announcementsSchema],
    meta: {
      errorMessage: 'Fetching announcements failed'
    },
    propagateError: true
  });
}
