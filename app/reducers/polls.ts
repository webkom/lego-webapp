import { createSelector } from 'reselect';
import { Poll } from '../actions/ActionTypes';
import createEntityReducer from '../utils/createEntityReducer';
import type { EntityId } from '@reduxjs/toolkit';
import type { Tags } from 'app/models';

export type OptionEntity = {
  id: number;
  name: string;
  votes: number;
};
export type PollEntity = {
  id: EntityId;
  title: string;
  description: string;
  resultsHidden: boolean;
  pinned: boolean;
  tags: Tags;
  hasAnswered: boolean;
  totalVotes: number;
  options: Array<OptionEntity>;
};
export default createEntityReducer({
  key: 'polls',
  types: {
    fetch: [Poll.FETCH, Poll.FETCH_ALL],
    mutate: Poll.CREATE,
    delete: Poll.DELETE,
  },
});
export const selectPolls = createSelector(
  (state) => state.polls.byId,
  (state) => state.polls.items,
  (pollsById, pollsIds) => {
    return pollsIds.map((id) => pollsById[id]);
  },
);
export const selectPollById = createSelector(
  selectPolls,
  (state, pollsId) => pollsId,
  (polls, pollsId) => {
    if (!polls || !pollsId) return {};
    return polls.find((polls) => Number(polls.id) === Number(pollsId));
  },
);
export const selectPinnedPolls = createSelector(selectPolls, (polls) =>
  polls.filter((polls) => polls.pinned),
);
