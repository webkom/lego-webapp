import {
  Flex,
  Skeleton,
  Page,
  PageCover,
  LinkButton,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import cx from 'classnames';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import {
  fetchAllMemberships,
  fetchAllWithType,
  fetchGroup,
} from 'app/actions/GroupActions';
import { fetchPage, fetchAll as fetchAllPages } from 'app/actions/PageActions';
import DisplayContent from 'app/components/DisplayContent';
import GroupMember from 'app/components/GroupMember';
import { readmeIfy } from 'app/components/ReadmeLogo';
import { GroupType } from 'app/models';
import { useIsLoggedIn } from 'app/reducers/auth';
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
} from 'app/reducers/pages';
import HTTPError from 'app/routes/errors/HTTPError';
import PageHierarchy from 'app/routes/pages/components/PageHierarchy';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { isNotNullish } from 'app/utils';
import LandingPage from './LandingPage';
import styles from './PageDetail.css';
import type { EntityId } from '@reduxjs/toolkit';
import type { ActionGrant } from 'app/models';
import type { HierarchySectionEntity } from 'app/routes/pages/components/PageHierarchy';
import type { RootState } from 'app/store/createRootReducer';
import type { AppDispatch } from 'app/store/createStore';
import type { PublicUser } from 'app/store/models/User';
import type { Thunk } from 'app/types';
import type { RoleType } from 'app/utils/constants';
import type { ComponentType } from 'react';

type PageRendererProps<T> = {
  page: T;
};
export type PageRenderer<T> = ComponentType<PageRendererProps<T>>;

export type Flatpage = {
  content: string;
};
const FlatpageRenderer: PageRenderer<Flatpage> = ({ page }) => (
  <article className={styles.detail}>
    <DisplayContent content={page.content} />
  </article>
);

export type GroupPage = {
  membershipsByRole: {
    [key: string]: {
      user: PublicUser;
      role: RoleType;
    }[];
  };
  text: string;
  name: string;
};
const GroupRenderer: PageRenderer<GroupPage> = ({ page }) => {
  const { membershipsByRole, text, name } = page;
  const {
    leader: leaders = [],
    'co-leader': co_leaders = [],
    member: members = [],
    active_retiree: activeRetirees = [],
  } = membershipsByRole;

  return (
    <article>
      <DisplayContent content={text} />
      {Object.values(membershipsByRole).some((array) => array.length > 0) && (
        <>
          <h3 className={styles.heading}>Medlemmer</h3>

          <div className={styles.membersSection}>
            <div className={styles.leaderBoard}>
              {leaders.map(({ user }) => (
                <GroupMember
                  user={user}
                  key={user.id}
                  leader
                  groupName={name}
                />
              ))}
              {co_leaders.map(({ user }) => (
                <GroupMember user={user} key={user.id} co_leader />
              ))}
            </div>

            <div className={styles.members}>
              {members.map(({ user, role }) => (
                <GroupMember user={user} role={role} key={user.id} />
              ))}
            </div>

            <div className={styles.members}>
              {activeRetirees.map(({ user }) => (
                <GroupMember user={user} key={user.id} />
              ))}
            </div>
          </div>
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
    fetchItemActions: [
      fetchGroup,
      (groupId: EntityId) => fetchAllMemberships(groupId, true),
    ],
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
    fetchItemActions: [
      fetchGroup,
      (groupId: EntityId) => fetchAllMemberships(groupId, true),
    ],
  },
  revy: {
    title: 'Revy',
    section: 'revy',
    pageInfoSelector: selectCommitteePageInfo,
    pageSelector: selectCommitteePage,
    PageRenderer: GroupRenderer,
    hierarchySectionSelector: selectRevueForHierarchy,
    fetchAll: () => fetchAllWithType(GroupType.Revue),
    fetchItemActions: [
      fetchGroup,
      (groupId: EntityId) => fetchAllMemberships(groupId, true),
    ],
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
      (action) => !action.toString().includes('fetchAllMemberships'),
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
export const MainPageRenderer = <T,>({
  page,
  PageRenderer,
}: MainPageRendererProps<T>) => {
  return (
    <article>
      <PageRenderer page={page} />
    </article>
  );
};
