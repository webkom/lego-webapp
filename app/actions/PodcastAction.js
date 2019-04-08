// @flow

import { Podcast } from './ActionTypes';
import { podcastSchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';
import type { Thunk } from 'app/types';
import { push } from 'connected-react-router';

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

export function deletePodcast(id: number) {
  return callAPI({
    types: Podcast.DELETE,
    endpoint: `/podcasts/${id}/`,
    method: 'DELETE',
    meta: {
      id,
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
  return dispatch =>
    dispatch(
      callAPI({
        types: Podcast.CREATE,
        endpoint: '/podcasts/',
        method: 'POST',
        body: data,
        schema: podcastSchema,
        meta: {
          errorMessage: 'Legg til podcast feilet',
          successMessage: 'Podcast lagt til'
        }
      })
    ).then(() => dispatch(push(`/podcasts/`)));
}

export function editPodcast({
  id,
  ...data
}: {
  id: number,
  title: string,
  source: string,
  description: string,
  authors: Array<number>
}): Thunk<*> {
  return dispatch =>
    dispatch(
      callAPI({
        types: Podcast.UPDATE,
        endpoint: `/podcasts/${id}/`,
        method: 'PUT',
        schema: podcastSchema,
        body: data,
        meta: {
          errorMessage: 'Endring av podcast feilet'
        }
      })
    ).then(() => dispatch(push(`/podcasts/`)));
}
