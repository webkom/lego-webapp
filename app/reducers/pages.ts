import { createSlice } from '@reduxjs/toolkit';
import { groupBy, sortBy, uniqBy } from 'lodash-es';
import { createSelector } from 'reselect';
import { selectMembershipsForGroup } from 'app/reducers/memberships';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import { Page } from '../actions/ActionTypes';
import { selectGroupById, selectGroupsByType } from './groups';
import { selectPaginationNext } from './selectors';
import type { EntityId } from '@reduxjs/toolkit';
import type { TransformedMembership } from 'app/reducers/memberships';
import type {
  Flatpage,
  GroupPage,
  HierarchySectionSelector,
  PageInfoSelector,
  PageSelector,
  UnknownSection,
} from 'app/routes/pages/components/PageDetail';
import type { RootState } from 'app/store/createRootReducer';
import type { PublicDetailedGroup } from 'app/store/models/Group';
import type { AuthDetailedPage, DetailedPage } from 'app/store/models/Page';

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

const groupMemberships = (
  memberships: TransformedMembership[],
  groupId: EntityId,
) => {
  // Sort membership so that the membership in the group is ordered before the descendants. When removing duplicates, the
  // descendant memberships will be removed if there are duplicates
  const membershipsUniqUsers = uniqBy(
    sortBy(
      memberships,
      (membership) => Number(membership.abakusGroup) !== Number(groupId),
    ),
    (membership) => membership.user.id,
  );
  return groupBy(sortBy(membershipsUniqUsers, 'user.fullName'), ({ role }) =>
    separateRoles.includes(role) ? role : defaultRole,
  );
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
