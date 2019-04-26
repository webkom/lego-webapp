// @flow

import { createSelector } from 'reselect';
import createEntityReducer from 'app/utils/createEntityReducer';
import { Podcast } from '../actions/ActionTypes';
<<<<<<< HEAD
=======
import { without } from 'lodash';
import produce from 'immer';
>>>>>>> Use without instead of pull, refactor some logic for better readability

export type PodcastEntity = {
  id: number,
  createdAt: string,
  source: string,
  title: string,
  discription: string
};

<<<<<<< HEAD
=======
type State = any;

const deletePodcast = produce(
  (newState: State, action: any): void => {
    switch (action.type) {
      case Podcast.DELETE.SUCCESS:
        newState.items = without(newState.items, action.meta.podcastId);
    }
  }
);

>>>>>>> Use without instead of pull, refactor some logic for better readability
export default createEntityReducer({
  key: 'podcasts',
  types: {
    fetch: Podcast.FETCH,
    mutate: Podcast.CREATE,
    delete: Podcast.DELETE
  }
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
