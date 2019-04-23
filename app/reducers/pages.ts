

import { createSelector } from 'reselect';
import { sortBy, groupBy } from 'lodash';
import { Page } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import { selectGroupsWithType } from './groups';
import { selectGroup } from 'app/reducers/groups';
import { selectMembershipsForGroup } from 'app/reducers/memberships';

export type PageEntity = {
  id: number,
  title: string,
  slug: string,
  content: string,
  comments: Array<number>,
  picture: string
};

export default createEntityReducer({
  key: 'pages',
  types: {
    fetch: Page.FETCH,
    mutate: Page.CREATE
  },
  mutate(state, action) {
    switch (action.type) {
      case Page.DELETE.SUCCESS:
        return {
          ...state,
          items: state.items.filter(id => action.meta.pageSlug !== id)
        };
      default:
        return state;
    }
  }
});

export const selectPageBySlug = createSelector(
  state => state.pages.byId,
  (state, props) => props.pageSlug,
  (pagesBySlug, pageSlug) => pagesBySlug[pageSlug]
);

export const selectPages = createSelector(
  state => state.pages.byId,
  (pagesBySlug, pageSlug) =>
    Object.keys(pagesBySlug).map(slug => pagesBySlug[slug])
);

export const selectPagesForHierarchy = (category: string) =>
  createSelector(
    state => selectPages(state),
    (state, props) => props.title,
    (pages, title) => ({
      title,
      items: (category === 'generelt'
        ? [
            {
              url: '/pages/info-om-abakus',
              title: 'Info om Abakus'
            }
          ]
        : []
      ).concat(
        sortBy(
          pages
            .filter(page => page.category === category)
            .map(page => ({
              url: `/pages/${page.category}/${page.slug}`,
              title: page.title
            })),
          'title'
        )
      )
    })
  );

export const selectGroupsForHierarchy = createSelector(
  state => selectGroupsWithType(state, { groupType: 'komite' }),
  (state, props) => props.title,
  (groups, title) => ({
    title,
    items: sortBy(
      groups.map(page => ({
        url: `/pages/komiteer/${page.id}`,
        title: page.name
      })),
      'title'
    )
  })
);

export const selectPageHierarchy = createSelector(
  (state, props) => props.sections,
  state => state,
  (sections, state) =>
    Object.keys(sections).map(sectionKey =>
      sections[sectionKey].hierarchySectionSelector(state, {
        title: sections[sectionKey].title
      })
    )
);

export const selectFlatpageForPages = createSelector(
  selectPageBySlug,
  (state, props) => props.pageSlug,
  (selectedPage, pageSlug) => ({
    selectedPage,
    selectedPageInfo: {
      isComplete: !!(selectedPage && selectedPage.actionGrant),
      actionGrant: selectedPage && selectedPage.actionGrant,
      title: selectedPage && selectedPage.title,
      editUrl: `/pages/${
        selectedPage ? selectedPage.category : 'info'
      }/${pageSlug}/edit`
    }
  })
);

const separateRoles = [
  'retiree',
  'active_retiree',
  'alumni',
  'retiree_email',
  'leader',
  'co-leader'
];
// Map all the other roles as if they were regular members
const defaultRole = 'member';

const groupMemberships = memberships =>
  groupBy(sortBy(memberships, 'user.fullName'), ({ role }) =>
    separateRoles.includes(role) ? role : defaultRole
  );

export const selectCommitteeForPages = createSelector(
  (state, props) => selectGroup(state, { groupId: Number(props.pageSlug) }),
  (state, props) =>
    selectMembershipsForGroup(state, { groupId: Number(props.pageSlug) }),
  (group, memberships) => {
    const selectedPageInfo = group && {
      isComplete: !!(group && group.actionGrant),
      actionGrant: group && group.actionGrant,
      title: group && group.name,
      editUrl: `/admin/groups/${group.id}/settings`
    };
    const membershipsByRole = groupMemberships(memberships);
    return {
      selectedPage: group && { ...group, membershipsByRole },
      selectedPageInfo
    };
  }
);

export const selectNotFoundpageForPages = createSelector(
  (state, props) => props.pageSlug,
  pageSlug => ({
    selectedPageInfo: {
      title: pageSlug,
      isComplete: true
    },
    selectedPage: {}
  })
);

export const selectInfoPageForPages = createSelector(
  (state, props) => props.pageSlug,
  pageSlug => ({
    selectedPageInfo: {
      title: 'Info om Abakus',
      isComplete: true
    },
    selectedPage: {}
  })
);
export const categoryOptions = [
  { value: 'arrangementer', label: 'Arrangementer' },
  { value: 'bedrifter', label: 'Bedrifter' },
  { value: 'generelt', label: 'Generelt' },
  { value: 'grupper', label: 'Grupper' }
];
