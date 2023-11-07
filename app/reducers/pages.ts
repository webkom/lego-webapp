import { uniqBy, sortBy, groupBy } from 'lodash';
import { createSelector } from 'reselect';
import { selectMembershipsForGroup } from 'app/reducers/memberships';
import createEntityReducer from 'app/utils/createEntityReducer';
import { Page } from '../actions/ActionTypes';
import { selectGroupsWithType, selectGroup } from './groups';
import { selectPaginationNext } from './selectors';
import type Membership from 'app/store/models/Membership';
import type { RoleType } from 'app/utils/constants';

export type PageEntity = {
  id: number;
  title: string;
  slug: string;
  content: string;
  comments: Array<number>;
  picture: string;
  picturePlaceholder: string;
  logo?: string;
  logoPlaceholder?: string;
  membershipsByRole: Record<RoleType, Membership[]>;
  text?: string;
  name?: string;
};
export default createEntityReducer({
  key: 'pages',
  types: {
    fetch: Page.FETCH,
    mutate: Page.CREATE,
    delete: Page.DELETE,
  },
});
export const selectPageBySlug = createSelector(
  (state) => state.pages.byId,
  (state, props) => props.pageSlug,
  (pagesBySlug, pageSlug) => pagesBySlug[pageSlug]
);
export const selectPages = createSelector(
  (state) => state.pages.byId,
  (pagesBySlug) => Object.keys(pagesBySlug).map((slug) => pagesBySlug[slug])
);
export const selectPagesForHierarchy = (category: string) =>
  createSelector(
    (state) => selectPages(state),
    (state, props) => props.title,
    (pages, title) => ({
      title,
      items: (category === 'generelt'
        ? [
            {
              url: '/pages/info-om-abakus',
              title: 'Info om Abakus',
            },
          ]
        : []
      ).concat(
        sortBy(
          pages
            .filter((page) => page.category === category)
            .map((page) => ({
              url: `/pages/${page.category}/${page.slug}`,
              title: page.title,
            })),
          'title'
        )
      ),
    })
  );

const createGroupSelector = (type: string, section: string) =>
  createSelector(
    (state) =>
      selectGroupsWithType(state, {
        groupType: type,
      }),
    (state, props) => props.title,
    (groups, title) => ({
      title,
      items: sortBy(
        groups.map((page) => ({
          url: `/pages/${section}/${page.id}`,
          title: page.name,
        })),
        'title'
      ),
    })
  );

export const selectCommitteeForHierarchy = createGroupSelector(
  'komite',
  'komiteer'
);
export const selectRevueForHierarchy = createGroupSelector('revy', 'revy');
export const selectBoardsForHierarchy = createGroupSelector('styre', 'styrer');
export const selectPageHierarchy = createSelector(
  (state, props) => props.sections,
  (state) => state,
  (sections, state) =>
    Object.keys(sections).map((sectionKey) =>
      sections[sectionKey].hierarchySectionSelector(state, {
        title: sections[sectionKey].title,
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
      }/${pageSlug}/edit`,
    },
  })
);
const separateRoles = [
  'retiree',
  'active_retiree',
  'alumni',
  'retiree_email',
  'leader',
  'co-leader',
];
// Map all the other roles as if they were regular members
const defaultRole = 'member';

const groupMemberships = (memberships, groupId) => {
  // Sort membership so that the membership in the group is ordered before the descendants. When removing duplicates, the
  // descendant memberships will be removed if there are duplicates
  const membershipsUniqUsers = uniqBy(
    sortBy(
      memberships,
      (membership) => Number(membership.abakusGroup) !== Number(groupId)
    ),
    (membership) => membership.user.id
  );
  return groupBy(sortBy(membershipsUniqUsers, 'user.fullName'), ({ role }) =>
    separateRoles.includes(role) ? role : defaultRole
  );
};

export const selectCommitteeForPages = createSelector(
  (state, { pageSlug }) =>
    selectGroup(state, {
      groupId: pageSlug,
    }),
  (
    state,
    props // $FlowFixMe pls
  ) =>
    selectMembershipsForGroup(state, {
      descendants: true,
      groupId: Number(props.pageSlug),
      pagination: selectPaginationNext({
        query: {
          descendants: true,
        },
        entity: 'memberships',
        endpoint: `/groups/${props.pageSlug}/memberships/`,
      })(state).pagination,
    }),
  (_, { pageSlug }) => pageSlug,
  (group, memberships, groupId) => {
    const selectedPageInfo = group && {
      isComplete: !!(group && group.actionGrant),
      actionGrant: group && group.actionGrant,
      title: group && group.name,
      editUrl: `/admin/groups/${group.id}/settings`,
    };
    const membershipsByRole = groupMemberships(memberships, groupId);
    return {
      selectedPage: group && { ...group, membershipsByRole },
      selectedPageInfo,
    };
  }
);
export const selectNotFoundpageForPages = createSelector(
  (state, props) => props.pageSlug,
  (pageSlug) => ({
    selectedPageInfo: {
      title: pageSlug,
      isComplete: true,
    },
    selectedPage: {},
  })
);
export const selectInfoPageForPages = createSelector(() => ({
  selectedPageInfo: {
    title: 'Info om Abakus',
    isComplete: true,
  },
  selectedPage: {},
}));
