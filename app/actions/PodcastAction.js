// @flow

import { Podcast } from './ActionTypes';
import { podcastSchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';
import type { Thunk } from 'app/types';

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

export function deletePodcast(podcastId: number) {
  return callAPI({
    types: Podcast.DELETE,
    endpoint: `/podcasts/${podcastId}/`,
    method: 'DELETE',
    meta: {
      podcastId: Number(podcastId),
      errorMessage: 'Sletting av podcast feilet'
    }
  });
}

export function addPodcast(data: {
  title: string,
  source: string,
  description: string,
  authors: Array<number>
}): Thunk<*> {
  return callAPI({
    types: Podcast.CREATE,
    endpoint: '/podcasts/',
    method: 'POST',
    body: data,
    schema: podcastSchema,
    meta: {
      errorMessage: 'Legg til podcast feilet',
      successMessage: 'Podcast lagt til'
    }
  });
}
