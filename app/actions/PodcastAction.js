// @flow

import { Podcast } from './ActionTypes';
import { push } from 'react-router-redux';
import { podcastSchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';
import { startSubmit, stopSubmit } from 'redux-form';
import type { Thunk } from 'app/types';
import { addToast } from 'app/actions/ToastActions';

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
      quoteId: Number(podcastId),
      errorMessage: 'Sletting av podcast feilet'
    }
  });
}

export function addPodcast({
  title,
  source,
  description
}: {
  title: string,
  source: string,
  description: string
}): Thunk<*> {
  return dispatch => {
    dispatch(startSubmit('createPodcast'));

    return dispatch(
      callAPI({
        types: Podcast.CREATE,
        endpoint: '/podcasts/',
        method: 'POST',
        body: {
          title,
          source,
          description
        },
        schema: podcastSchema,
        meta: {
          errorMessage: 'Legg til podcast feilet'
        }
      })
    ).then(() => {
      dispatch(stopSubmit('createPodcast'));
      dispatch(push('/podcasts'));
      dispatch(
        addToast({
          message: 'Podcast sendt inn.',
          dismissAfter: 10000
        })
      );
    });
  };
}
