import { createSlice } from '@reduxjs/toolkit';
import { sortBy } from 'lodash';
import moment from 'moment-timezone';
import { createSelector } from 'reselect';
import { fetchData } from 'app/actions/FrontpageActions';
import addFetchingReducer from 'app/store/utils/entityReducer/fetching';
import { selectArticles } from './articles';
import { selectEvents } from './events';

interface FrontpageState {
  fetching: boolean;
}

const initialState: FrontpageState = {
  fetching: false,
};

const frontpageSlice = createSlice({
  name: 'frontpage',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    addFetchingReducer(builder, fetchData);
  },
});

export default frontpageSlice.reducer;

export const selectFrontpage = createSelector(
  selectArticles,
  selectEvents,
  (articles, events) => {
    articles = articles.map((article) => ({
      ...article,
      documentType: 'article',
    }));
    events = events.map((event) => ({ ...event, documentType: 'event' }));
    const now = moment();
    return sortBy(
      [...articles, ...events],
      [
        // Always sort pinned items first:
        (item) => item.pinned,
        (item) => {
          // For events we care about when the event starts, whereas for articles
          // we look at when it was written:
          const timeField =
            'eventType' in item ? item.startTime : item.createdAt;
          return Math.abs(now.diff(timeField));
        },
        (item) => item.id,
      ]
    );
  }
);
