import {
  Flex,
  Skeleton,
  Page,
  PageCover,
  LinkButton,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import cx from 'classnames';
import moment from 'moment-timezone';
import { useEffect, type ComponentType } from 'react';
import { Helmet } from 'react-helmet-async';
import { GroupType } from 'app/models';
import DisplayContent from '~/components/DisplayContent';
import GroupMember from '~/components/GroupMember';
import { readmeIfy } from '~/components/ReadmeLogo';
import HTTPError from '~/components/errors/HTTPError';
import LandingPage from '~/pages/pages/_components/LandingPage';
import PageHierarchy from '~/pages/pages/_components/PageHierarchy';
import { postGettingWood } from '~/redux/actions/AchievementActions';
import {
  fetchAllMemberships,
  fetchAllWithType,
  fetchGroup,
} from '~/redux/actions/GroupActions';
import {
  fetchPage,
  fetchAll as fetchAllPages,
} from '~/redux/actions/PageActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { useIsLoggedIn } from '~/redux/slices/auth';
import {
  selectPagesForHierarchy,
  selectCommitteeForHierarchy,
  selectRevueForHierarchy,
  selectBoardsForHierarchy,
  selectPageHierarchy,
  selectCommitteePage,
  selectFlatpagePage,
  selectOmAbakusPageInfo,
  selectFlatpagePageInfo,
  selectCommitteePageInfo,
  selectNotFoundPageInfo,
} from '~/redux/slices/pages';
import { isNotNullish } from '~/utils';
import { useParams } from '~/utils/useParams';
import styles from './PageDetail.module.css';
import type { EntityId } from '@reduxjs/toolkit';
import type { ActionGrant, Dateish } from 'app/models';
import type { Thunk } from 'app/types';
import type { HierarchySectionEntity } from '~/pages/pages/_components/PageHierarchy';
import type { AppDispatch } from '~/redux/createStore';
import type { PublicUser } from '~/redux/models/User';
import type { RootState } from '~/redux/rootReducer';
import type { RoleType } from '~/utils/constants';

type PageRendererProps<T> = {
  page: T;
};
export type PageRenderer<T> = ComponentType<PageRendererProps<T>>;

export type Flatpage = {
  content: string;
};
const FlatpageRenderer: PageRenderer<Flatpage> = ({ page }) => (
  <article>
    <DisplayContent content={page.content} />
  </article>
);

export type GroupPage = {
  membershipsByRole: {
    user: PublicUser;
    roles: RoleType[];
    createdAt: Dateish;
    firstJoinDate: Dateish;
  }[];
  text: string;
  name: string;
};

const rolePriority: Record<RoleType, number> = {
  leader: 1,
  'co-leader': 2,
  member: 3,
  active_retiree: 4,
  treasurer: 3,
  recruiting: 3,
  development: 3,
  editor: 3,
  retiree: 4,
  media_relations: 3,
  alumni: 4,
  webmaster: 3,
  interest_group_admin: 3,
  alumni_admin: 3,
  retiree_email: 4,
  company_admin: 3,
  dugnad_admin: 3,
  trip_admin: 3,
  sponsor_admin: 3,
  social_admin: 3,
  merch_admin: 3,
  hs_representative: 3,
  cuddling_manager: 3,
  photo_admin: 3,
  graphic_admin: 3,
  social_media_admin: 3,
};

const sortMemberships = (
  a: { roles: RoleType[]; firstJoinDate: Dateish },
  b: { roles: RoleType[]; firstJoinDate: Dateish },
) => {
  const getHighestPriority = (roles: RoleType[]) =>
    Math.min(...roles.map((role) => rolePriority[role] ?? 3));

  const priorityA = getHighestPriority(a.roles);
  const priorityB = getHighestPriority(b.roles);

  if (priorityA !== priorityB) {
    return priorityA - priorityB;
  }

  return moment(a.firstJoinDate).valueOf() - moment(b.firstJoinDate).valueOf();
};

const GroupRenderer: PageRenderer<GroupPage> = ({ page }) => {
  const { membershipsByRole, text, name } = page;
  const sortedMemberships = [...membershipsByRole].sort(sortMemberships);

  const leaders = sortedMemberships.filter((membership) =>
    membership.roles.some((role) => ['leader', 'co-leader'].includes(role)),
  );

  const retirees = sortedMemberships.filter((membership) =>
    membership.roles.some((role) =>
      ['active_retiree', 'retiree', 'alumni', 'retiree_email'].includes(role),
    ),
  );

  const leaderIds = new Set(leaders.map((membership) => membership.user.id));
  const retireeIds = new Set(retirees.map((membership) => membership.user.id));

  const members = sortedMemberships.filter(
    (membership) =>
      !leaderIds.has(membership.user.id) && !retireeIds.has(membership.user.id),
  );

  return (
    <article>
      <DisplayContent content={text} />
      {sortedMemberships.length > 0 && (
        <>
          <h3 className={styles.heading}>Medlemmer</h3>
          <Flex column justifyContent="center">
            <Flex wrap justifyContent="center">
              {leaders.map(({ user, roles }) => (
                <GroupMember
                  user={user}
                  roles={roles}
                  key={user.id}
                  groupName={name}
                />
              ))}
            </Flex>
            <Flex wrap justifyContent="center">
              {members.map(({ user, roles }) => (
                <GroupMember
                  user={user}
                  roles={roles}
                  key={user.id}
                  groupName={name}
                />
              ))}
            </Flex>
            {retirees.length > 0 && (
              <>
                <h3 className={styles.heading}>Panger</h3>
                <Flex wrap justifyContent="center">
                  {retirees.map(({ user, roles }) => (
                    <GroupMember
                      user={user}
                      roles={roles}
                      key={user.id}
                      groupName={name}
                    />
                  ))}
                </Flex>
              </>
            )}
          </Flex>
        </>
      )}
    </article>
  );
};

export type PageInfo = {
  editUrl?: string;
  title: string;
  banner: string;
  bannerPlaceholder: string;
  actionGrant?: ActionGrant;
};
export type PageInfoSelector = (
  state: RootState,
  pageSlug: string,
) => PageInfo | undefined;
export type PageSelector<T> = (
  state: RootState,
  pageSlug: string,
) => T | undefined;

export type HierarchySectionSelector = (
  state: RootState,
  title: string,
) => HierarchySectionEntity;

type Section<T = unknown> = {
  title: string;
  section: string;
  pageInfoSelector: PageInfoSelector;
  pageSelector: PageSelector<T>;
  PageRenderer: PageRenderer<T>;
  hierarchySectionSelector: HierarchySectionSelector;
  fetchAll?: () => Thunk<void>;
  fetchItemActions: (
    | ((id: string) => Thunk<void>)
    | ((id: EntityId) => Thunk<void>)
  )[];
};
export type UnknownSection =
  | Section<Flatpage>
  | Section<GroupPage>
  | Section<null>;

const fetchAllMembershipsWithDecendants = (groupId: EntityId) =>
  fetchAllMemberships(groupId, true);

const sections: Record<string, UnknownSection> = {
  generelt: {
    title: 'Generelt',
    section: 'generelt',
    pageInfoSelector: selectFlatpagePageInfo,
    pageSelector: selectFlatpagePage,
    PageRenderer: FlatpageRenderer,
    hierarchySectionSelector: selectPagesForHierarchy('generelt'),
    fetchAll: fetchAllPages,
    fetchItemActions: [fetchPage],
  },
  organisasjon: {
    title: 'Organisasjon',
    section: 'organisasjon',
    pageInfoSelector: selectFlatpagePageInfo,
    pageSelector: selectFlatpagePage,
    PageRenderer: FlatpageRenderer,
    hierarchySectionSelector: selectPagesForHierarchy('organisasjon'),
    fetchAll: fetchAllPages,
    fetchItemActions: [fetchPage],
  },
  styrer: {
    title: 'Styrer',
    section: 'styrer',
    pageInfoSelector: selectCommitteePageInfo,
    pageSelector: selectCommitteePage,
    PageRenderer: GroupRenderer,
    hierarchySectionSelector: selectBoardsForHierarchy,
    fetchAll: () => fetchAllWithType(GroupType.Board),
    fetchItemActions: [fetchGroup, fetchAllMembershipsWithDecendants],
  },
  bedrifter: {
    title: 'Bedrifter',
    section: 'bedrifter',
    pageInfoSelector: selectFlatpagePageInfo,
    pageSelector: selectFlatpagePage,
    PageRenderer: FlatpageRenderer,
    hierarchySectionSelector: selectPagesForHierarchy('bedrifter'),
    fetchItemActions: [fetchPage],
  },
  arrangementer: {
    title: 'Arrangementer',
    section: 'arrangementer',
    pageInfoSelector: selectFlatpagePageInfo,
    pageSelector: selectFlatpagePage,
    PageRenderer: FlatpageRenderer,
    hierarchySectionSelector: selectPagesForHierarchy('arrangementer'),
    fetchItemActions: [fetchPage],
  },
  komiteer: {
    title: 'Komiteer',
    section: 'komiteer',
    pageInfoSelector: selectCommitteePageInfo,
    pageSelector: selectCommitteePage,
    PageRenderer: GroupRenderer,
    hierarchySectionSelector: selectCommitteeForHierarchy,
    fetchAll: () => fetchAllWithType(GroupType.Committee),
    fetchItemActions: [fetchGroup, fetchAllMembershipsWithDecendants],
  },
  revy: {
    title: 'Revy',
    section: 'revy',
    pageInfoSelector: selectCommitteePageInfo,
    pageSelector: selectCommitteePage,
    PageRenderer: GroupRenderer,
    hierarchySectionSelector: selectRevueForHierarchy,
    fetchAll: () => fetchAllWithType(GroupType.Revue),
    fetchItemActions: [fetchGroup, fetchAllMembershipsWithDecendants],
  },
  grupper: {
    title: 'Grupper',
    section: 'grupper',
    pageInfoSelector: selectFlatpagePageInfo,
    pageSelector: selectFlatpagePage,
    PageRenderer: FlatpageRenderer,
    hierarchySectionSelector: selectPagesForHierarchy('grupper'),
    fetchItemActions: [fetchPage],
  },
  utnevnelser: {
    title: 'Utnevnelser',
    section: 'utnevnelser',
    pageInfoSelector: selectFlatpagePageInfo,
    pageSelector: selectFlatpagePage,
    PageRenderer: FlatpageRenderer,
    hierarchySectionSelector: selectPagesForHierarchy('utnevnelser'),
    fetchAll: fetchAllPages,
    fetchItemActions: [fetchPage],
  },
  personvern: {
    title: 'Personvern',
    section: 'personvern',
    pageInfoSelector: selectFlatpagePageInfo,
    pageSelector: selectFlatpagePage,
    PageRenderer: FlatpageRenderer,
    hierarchySectionSelector: selectPagesForHierarchy('personvern'),
    fetchItemActions: [fetchPage],
  },
  'info-om-abakus': {
    title: 'Info om Abakus',
    section: 'info-om-abakus',
    pageInfoSelector: selectOmAbakusPageInfo,
    pageSelector: () => null,
    PageRenderer: LandingPage,
    hierarchySectionSelector: () => ({
      title: 'hehe',
      items: [],
    }),
    fetchItemActions: [],
  },
};

export const categoryOptions = Object.keys(sections)
  .map((key) => sections[key])
  .filter((entry) => entry.pageSelector === selectFlatpagePage)
  .map((entry) => ({
    value: entry.section,
    label: entry.title,
  }));

const getSection = (sectionName: string): UnknownSection =>
  sections[sectionName] ||
  ({
    title: '',
    section: '',
    hierarchySectionSelector: () => ({
      title: '',
      items: [],
    }),
    pageInfoSelector: selectNotFoundPageInfo,
    pageSelector: () => null,
    PageRenderer: () => <HTTPError />,
    fetchItemActions: [],
  } satisfies Section<null>);

const loadData = async (
  pageSlug: string,
  sectionName: string,
  loggedIn: boolean,
  dispatch: AppDispatch,
) => {
  const { fetchItemActions } = getSection(sectionName);

  // Only handle flatpages and groups when user isn't authenticated
  let actionsToDispatch = fetchItemActions;
  if (!loggedIn) {
    actionsToDispatch = fetchItemActions.filter(
      (action) => action !== fetchAllMembershipsWithDecendants,
    );
  }

  const itemActions = actionsToDispatch.map((action) =>
    dispatch(action(pageSlug)),
  );

  // Avoid dispatching duplicate actions
  const uniqueFetches = [
    ...new Set(
      Object.keys(sections)
        .map((key) => sections[key].fetchAll)
        .filter(isNotNullish),
    ),
  ];
  return Promise.all(
    uniqueFetches.map((fetch) => dispatch(fetch())).concat(itemActions),
  );
};

const PageSkeleton = () => {
  return (
    <Flex column gap="var(--spacing-xl)">
      <Skeleton className={cx(styles.header, styles.skeletonHeader)} />
      <div>
        <Skeleton className={styles.skeletonBody1} />
        <Skeleton className={styles.skeletonBody2} />
        <Skeleton className={styles.skeletonBody3} />
      </div>
    </Flex>
  );
};

export type PageDetailParams = {
  pageSlug?: string;
  section: string;
};
const PageDetail = () => {
  const { pageSlug, section: sectionName } =
    useParams<PageDetailParams>() as PageDetailParams;

  const pageHierarchy = useAppSelector((state) =>
    selectPageHierarchy(state, Object.values(sections)),
  );
  const { pageSelector, pageInfoSelector, PageRenderer } =
    getSection(sectionName);
  const pageInfo = useAppSelector((state) =>
    pageInfoSelector(state, pageSlug || ''),
  );
  const page = useAppSelector((state) => pageSelector(state, pageSlug || ''));

  const loggedIn = useIsLoggedIn();

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (pageSlug === '26-arrangementsregler') {
      dispatch(postGettingWood());
    }
  }, [dispatch, pageSlug]);

  usePreparedEffect(
    'fetchPageDetail',
    () => loadData(pageSlug || '', sectionName, loggedIn, dispatch),
    [pageSlug],
  );

  const actionGrant = pageInfo?.actionGrant || [];

  const showSkeleton = page === undefined;

  return (
    <Page
      title={readmeIfy(pageInfo?.title)}
      cover={
        showSkeleton ? (
          <PageCover skeleton />
        ) : (
          pageInfo?.banner && (
            <PageCover
              image={pageInfo.banner}
              imagePlaceholder={pageInfo.bannerPlaceholder}
            />
          )
        )
      }
      sidebar={{
        title: 'Om Abakus',
        side: 'left',
        icon: 'menu',
        content: (
          <PageHierarchy
            pageHierarchy={pageHierarchy}
            handleCloseSidebar={() => {}}
          />
        ),
      }}
      actionButtons={[
        actionGrant.includes('edit') && pageInfo?.editUrl && (
          <LinkButton href={pageInfo?.editUrl}>Rediger</LinkButton>
        ),
        actionGrant.includes('create') && (
          <LinkButton href="/pages/new">Lag ny</LinkButton>
        ),
      ]}
      skeleton={showSkeleton}
    >
      <Helmet title={pageInfo?.title} />
      {showSkeleton ? (
        <PageSkeleton />
      ) : (
        <MainPageRenderer
          page={page}
          PageRenderer={
            // typescript is being stupid
            PageRenderer as PageRenderer<typeof page>
          }
        />
      )}
    </Page>
  );
};

export default PageDetail;

type MainPageRendererProps<T> = {
  page: T;
  PageRenderer: PageRenderer<T>;
};
const MainPageRenderer = <T,>({
  page,
  PageRenderer,
}: MainPageRendererProps<T>) => {
  return (
    <article>
      <PageRenderer page={page} />
    </article>
  );
};
