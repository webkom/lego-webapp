

import { createSelector } from 'reselect';
import createEntityReducer from 'app/utils/createEntityReducer';
import { Podcast } from '../actions/ActionTypes';

export type PodcastEntity = {
  id: number,
  createdAt: string,
  source: string,
  title: string,
  discription: string
};

const deletePodcast = (state: any, action: any) => {
  switch (action.type) {
    case Podcast.DELETE.SUCCESS:
      return {
        ...state,
        items: state.items.filter(id => id !== action.meta.podcastId)
      };
    default:
      return state;
  }
};

export default createEntityReducer({
  key: 'podcasts',
  types: {
    fetch: Podcast.FETCH,
    mutate: Podcast.CREATE
  },
  mutate: deletePodcast
});

export const selectPodcasts = createSelector(
  state => state.podcasts.byId,
  state => state.podcasts.items,
  (podcastsById, podcastIds) => {
    return podcastIds.map(id => podcastsById[id]);
  }
);

export const selectPodcastById = createSelector(
  selectPodcasts,
  (state, podcastId) => podcastId,
  (podcasts, podcastId) => {
    if (!podcasts || !podcastId) return {};
    return podcasts.find(podcast => Number(podcast.id) === Number(podcastId));
  }
);
