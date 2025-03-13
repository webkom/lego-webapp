import { createSlice } from '@reduxjs/toolkit';
import { groupBy, sortBy, uniqBy } from 'lodash';
import { createSelector } from 'reselect';
import { Page } from '~/redux/actionTypes';
import createLegoAdapter from '~/redux/legoAdapter/createLegoAdapter';
import { EntityType } from '~/redux/models/entities';
import { selectMembershipsForGroup } from '~/redux/slices/memberships';
import { selectGroupById, selectGroupsByType } from './groups';
import { selectPaginationNext } from './selectors';
import type { EntityId } from '@reduxjs/toolkit';
import type {
  Flatpage,
  GroupPage,
  HierarchySectionSelector,
  PageInfoSelector,
  PageSelector,
  UnknownSection,
} from '~/pages/pages/page/+Page';
import type { PublicDetailedGroup } from '~/redux/models/Group';
import type { AuthDetailedPage, DetailedPage } from '~/redux/models/Page';
import type { RootState } from '~/redux/rootReducer';
import type { TransformedMembership } from '~/redux/slices/memberships';
import { GroupMembership } from 'app/models';
import Membership from '../models/Membership';
import moment from 'moment-timezone';

const legoAdapter = createLegoAdapter(EntityType.Pages, {
  selectId: (page) => page.slug,
});

const pagesSlice = createSlice({
  name: EntityType.Pages,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [Page.FETCH],
    deleteActions: [Page.DELETE],
  }),
});

export default pagesSlice.reducer;

export const { selectAll: selectAllPages, selectById: selectPageById } =
  legoAdapter.getSelectors((state: RootState) => state.pages);

export const selectPagesForHierarchy = (
  category: string,
): HierarchySectionSelector =>
  createSelector(
    selectAllPages,
    (_: RootState, title: string) => title,
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
          'title',
        ),
      ),
    }),
  );

const createGroupSelector = (
  type: string,
  section: string,
): HierarchySectionSelector =>
  createSelector(
    (state: RootState) => selectGroupsByType(state, type),
    (_: RootState, title: string) => title,
    (groups, title) => ({
      title,
      items: sortBy(
        groups.map((page) => ({
          url: `/pages/${section}/${page.id}`,
          title: page.name,
        })),
        'title',
      ),
    }),
  );

export const selectCommitteeForHierarchy = createGroupSelector(
  'komite',
  'komiteer',
);
export const selectRevueForHierarchy = createGroupSelector('revy', 'revy');
export const selectBoardsForHierarchy = createGroupSelector('styre', 'styrer');
export const selectPageHierarchy = createSelector(
  (_: RootState, sections: UnknownSection[]) => sections,
  (state: RootState) => state,
  (sections, state) =>
    sections.map(({ hierarchySectionSelector, title }) =>
      hierarchySectionSelector(state, title),
    ),
);
export const selectFlatpagePageInfo: PageInfoSelector = createSelector(
  (state: RootState, pageSlug: string) =>
    selectPageById(state, pageSlug) as
      | DetailedPage
      | AuthDetailedPage
      | undefined,
  (_: RootState, pageSlug: string) => pageSlug,
  (page, pageSlug) =>
    page
      ? {
          actionGrant: page.actionGrant,
          title: page.title,
          editUrl: `/pages/${page.category}/${pageSlug}/edit`,
          banner: page.picture,
          bannerPlaceholder: page.picturePlaceholder,
        }
      : undefined,
);
export const selectFlatpagePage: PageSelector<Flatpage> = createSelector(
  selectPageById,
  (page) => (page && 'content' in page ? { content: page.content } : undefined),
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

const groupMemberships = (memberships: Membership[], groupId: EntityId) => {
  // Sort memberships by whether they belong to the given group
  const sortedMemberships = sortBy(
    memberships,
    (m) => Number(m.abakusGroup) !== Number(groupId),
  );

  const membershipMap = new Map();

  for (const membership of sortedMemberships) {
    if (!membershipMap.has(membership.user)) {
      membershipMap.set(membership.user, {
        user: membership.user,
        roles: new Set([membership.role]),
        createdAt: membership.createdAt,
      });
    } else {
      const existing = membershipMap.get(membership.user);
      existing.roles.add(membership.role);

      if (moment(membership.createdAt) < moment(existing.createdAt)) {
        existing.createdAt = membership.createdAt;
      }
    }
  }

  const combinedMemberships = Array.from(membershipMap.values()).map(
    ({ user, roles, createdAt }) => ({
      user,
      roles: Array.from(roles),
      createdAt,
    }),
  );

  return combinedMemberships;
};

export const selectCommitteePageInfo: PageInfoSelector = createSelector(
  (state: RootState, pageSlug: string) =>
    selectGroupById(state, pageSlug) as PublicDetailedGroup,
  (group) =>
    group && {
      actionGrant: group.actionGrant,
      title: group.name,
      editUrl: `/admin/groups/${group.id}/settings`,
      banner: group.logo || '',
      bannerPlaceholder: group.logoPlaceholder || '',
    },
);
export const selectCommitteePage: PageSelector<GroupPage> = createSelector(
  (state: RootState, pageSlug: string) =>
    selectGroupById(state, pageSlug) as PublicDetailedGroup,
  (state: RootState, pageSlug: string) =>
    selectMembershipsForGroup(state, {
      descendants: true,
      groupId: Number(pageSlug),
      pagination: selectPaginationNext({
        query: {
          descendants: 'true',
        },
        entity: 'memberships',
        endpoint: `/groups/${pageSlug}/memberships/`,
      })(state).pagination,
    }),
  (_: RootState, pageSlug: string) => pageSlug,
  (group, memberships, groupId) =>
    group
      ? {
          membershipsByRole: groupMemberships(memberships, groupId),
          name: group.name,
          text: group.text,
        }
      : undefined,
);
export const selectNotFoundPageInfo: PageInfoSelector = createSelector(
  (_: RootState, pageSlug: string) => pageSlug,
  (pageSlug) => ({
    title: pageSlug,
    banner: '',
    bannerPlaceholder: '',
  }),
);
export const selectOmAbakusPageInfo: PageInfoSelector = () => ({
  title: 'Info om Abakus',
  banner: '',
  bannerPlaceholder: '',
});
