import moment from 'moment-timezone';
import { Frontpage } from 'app/actions/ActionTypes';
import { fetching } from 'app/utils/createEntityReducer';
import { sortBy } from 'lodash';
import { createSelector } from 'reselect';
import { selectArticles } from './articles';
import { selectEvents } from './events';
import { groupSchema } from '.';
import { selectGroups, selectGroupsWithType } from './groups';
import { GroupTypeInterest } from 'app/models';

export default fetching(Frontpage.FETCH);

export const selectFrontpage = createSelector(
  selectArticles,
  selectEvents,
  (state) => selectGroupsWithType(state, { groupType: GroupTypeInterest }),
  (articles, events, interestGroups) => {
    articles = articles.map((article) => ({
      ...article,
      documentType: 'article',
    }));
    events = events.map((event) => ({ ...event, documentType: 'event' }));
    interestGroups = interestGroups.map((interestGroup) => ({
      ...interestGroup,
      documentType: 'interestgroup',
    }));
    const now = moment();
    return sortBy(articles.concat(events), [
      // Always sort pinned items first:
      (item) => !item.pinned,
      (item) => {
        // For events we care about when the event starts, whereas for articles
        // we look at when it was written:
        const timeField = item.eventType ? item.startTime : item.createdAt;
        return Math.abs(now.diff(timeField));
      },
      (item) => item.id,
    ]).concat(interestGroups);
  }
);
