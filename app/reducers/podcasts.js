// @flow

import { createSelector } from 'reselect';

import createEntityReducer from 'app/utils/createEntityReducer';
import { Podcast } from '../actions/ActionTypes';

export type PodcastEntity = {
  id: number,
  createdAt: string,
  source: string,
  title: string,
  discription: string,
};

export default createEntityReducer({
  key: 'podcasts',
  types: {
    fetch: Podcast.FETCH,
    mutate: Podcast.CREATE,
    delete: Podcast.DELETE,
  },
});

export const selectPodcasts = createSelector(
  (state) => state.podcasts.byId,
  (state) => state.podcasts.items,
  (podcastsById, podcastIds) => {
    return podcastIds.map((id) => podcastsById[id]);
  }
);

export const selectPodcastById = createSelector(
  selectPodcasts,
  (state, podcastId) => podcastId,
  (podcasts, podcastId) => {
    if (!podcasts || !podcastId) return {};
    return podcasts.find((podcast) => Number(podcast.id) === Number(podcastId));
  }
);
