// @flow

import { Podcast } from './ActionTypes';
import { podcastSchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';

export function fetchPodcasts() {
  return callAPI({
    types: Podcast.FETCH,
    endpoint: `/podcasts/`,
    method: 'GET',
    meta: {
      errorMessage: 'Henting av podcasts feilet'
    },
    schema: [podcastSchema],
    propagateError: true
  });
}

export function fetchPodcast(podcastId: number) {
  return callAPI({
    types: Podcast.FETCH,
    endpoint: `/podcasts/${podcastId}/`,
    method: 'GET',
    meta: {
      podcastId,
      errorMessage: 'Henting av podcast feilet'
    },
    schema: podcastSchema,
    propagateError: true
  });
}
