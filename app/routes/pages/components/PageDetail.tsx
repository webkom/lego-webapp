import { Flex, Icon, LoadingIndicator } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import {
  fetchAllMemberships,
  fetchAllWithType,
  fetchGroup,
} from 'app/actions/GroupActions';
import { fetchPage, fetchAll as fetchAllPages } from 'app/actions/PageActions';
import { Content } from 'app/components/Content';
import DisplayContent from 'app/components/DisplayContent';
import GroupMember from 'app/components/GroupMember';
import { Image } from 'app/components/Image';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import { readmeIfy } from 'app/components/ReadmeLogo';
import { GroupType } from 'app/models';
import {
  selectPagesForHierarchy,
  selectCommitteeForHierarchy,
  selectRevueForHierarchy,
  selectBoardsForHierarchy,
  selectPageHierarchy,
  selectCommitteeForPages,
  selectFlatpageForPages,
  selectNotFoundpageForPages,
  selectInfoPageForPages,
} from 'app/reducers/pages';
import { useUserContext } from 'app/routes/app/AppRoute';
import HTTPError from 'app/routes/errors/HTTPError';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import LandingPage from './LandingPage';
import styles from './PageDetail.css';
import Sidebar from './Sidebar';
import type { ActionGrant } from 'app/models';
import type { PageEntity } from 'app/reducers/pages';
import type { Thunk } from 'app/types';
import type { ComponentType } from 'react';

const FlatpageRenderer: PageRenderer = ({ page }) => (
  <article className={styles.detail}>
    <DisplayContent content={page.content} />
  </article>
);

const GroupRenderer: PageRenderer = ({ page }) => {
  const { membershipsByRole, text, name } = page;
  const {
    leader: leaders = [],
    'co-leader': co_leaders = [],
    member: members = [],
    active_retiree: activeRetirees = [],
  } = membershipsByRole;

  return (
    <article className={styles.detail}>
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

type Entry = {
  title: string;
  section: string;
  pageSelector: any;
  hierarchySectionSelector: any;
  PageRenderer: PageRenderer;
  fetchAll?: () => Thunk<any>;
  fetchItemActions: Array<
    ((arg0: number) => Thunk<any>) | ((arg0: string) => Thunk<any>)
  >;
};
const sections: Record<string, Entry> = {
  generelt: {
    title: 'Generelt',
    section: 'generelt',
    pageSelector: selectFlatpageForPages,
    hierarchySectionSelector: selectPagesForHierarchy('generelt'),
    PageRenderer: FlatpageRenderer,
    fetchAll: fetchAllPages,
    fetchItemActions: [fetchPage],
  },
  organisasjon: {
    title: 'Organisasjon',
    section: 'organisasjon',
    pageSelector: selectFlatpageForPages,
    hierarchySectionSelector: selectPagesForHierarchy('organisasjon'),
    PageRenderer: FlatpageRenderer,
    fetchAll: fetchAllPages,
    fetchItemActions: [fetchPage],
  },
  styrer: {
    title: 'Styrer',
    section: 'styrer',
    pageSelector: selectCommitteeForPages,
    hierarchySectionSelector: selectBoardsForHierarchy,
    PageRenderer: GroupRenderer,
    fetchAll: () => fetchAllWithType(GroupType.Board),
    fetchItemActions: [
      fetchGroup,
      (groupId: number) => fetchAllMemberships(groupId, true),
    ],
  },
  bedrifter: {
    title: 'Bedrifter',
    section: 'bedrifter',
    pageSelector: selectFlatpageForPages,
    hierarchySectionSelector: selectPagesForHierarchy('bedrifter'),
    PageRenderer: FlatpageRenderer,
    fetchItemActions: [fetchPage],
  },
  arrangementer: {
    title: 'Arrangementer',
    section: 'arrangementer',
    pageSelector: selectFlatpageForPages,
    hierarchySectionSelector: selectPagesForHierarchy('arrangementer'),
    PageRenderer: FlatpageRenderer,
    fetchItemActions: [fetchPage],
  },
  komiteer: {
    title: 'Komiteer',
    section: 'komiteer',
    pageSelector: selectCommitteeForPages,
    hierarchySectionSelector: selectCommitteeForHierarchy,
    PageRenderer: GroupRenderer,
    fetchAll: () => fetchAllWithType(GroupType.Committee),
    fetchItemActions: [
      fetchGroup,
      (groupId: number) => fetchAllMemberships(groupId, true),
    ],
  },
  revy: {
    title: 'Revy',
    section: 'revy',
    pageSelector: selectCommitteeForPages,
    hierarchySectionSelector: selectRevueForHierarchy,
    PageRenderer: GroupRenderer,
    fetchAll: () => fetchAllWithType(GroupType.Revue),
    fetchItemActions: [
      fetchGroup,
      (groupId: number) => fetchAllMemberships(groupId, true),
    ],
  },
  grupper: {
    title: 'Grupper',
    section: 'grupper',
    pageSelector: selectFlatpageForPages,
    hierarchySectionSelector: selectPagesForHierarchy('grupper'),
    PageRenderer: FlatpageRenderer,
    fetchItemActions: [fetchPage],
  },
  utnevnelser: {
    title: 'Utnevnelser',
    section: 'utnevnelser',
    pageSelector: selectFlatpageForPages,
    hierarchySectionSelector: selectPagesForHierarchy('utnevnelser'),
    PageRenderer: FlatpageRenderer,
    fetchAll: fetchAllPages,
    fetchItemActions: [fetchPage],
  },
  personvern: {
    title: 'Personvern',
    section: 'personvern',
    pageSelector: selectFlatpageForPages,
    hierarchySectionSelector: selectPagesForHierarchy('personvern'),
    PageRenderer: FlatpageRenderer,
    fetchItemActions: [fetchPage],
  },
  'info-om-abakus': {
    title: 'Info om Abakus',
    section: 'info-om-abakus',
    pageSelector: selectInfoPageForPages,
    hierarchySectionSelector: () => ({
      title: 'hehe',
      items: [],
    }),
    PageRenderer: LandingPage,
    fetchItemActions: [],
  },
};

export const categoryOptions = Object.keys(sections)
  .map<Entry>((key) => sections[key])
  .filter((entry: Entry) => entry.pageSelector === selectFlatpageForPages)
  .map<{
    value: string;
    label: string;
  }>((entry: Entry) => ({
    value: entry.section,
    label: entry.title,
  }));

const getSection = (sectionName) =>
  sections[sectionName] || {
    pageSelector: selectNotFoundpageForPages,
    PageRenderer: HTTPError,
    fetchItemActions: [],
  };

const loadData = async (pageSlug, section, loggedIn, dispatch) => {
  const { fetchItemActions } = getSection(section);

  // Only handle flatpages and groups when user isn't authenticated
  if (!loggedIn) {
    const actionsToDispatch = fetchItemActions
      .filter((action) => !action.toString().includes('fetchAllMemberships'))
      .map((action) => dispatch(action(pageSlug)));

    return Promise.all([...actionsToDispatch, dispatch(fetchAllPages())]);
  }

  const itemActions = [];

  for (let i = 0; i < fetchItemActions.length; i++) {
    itemActions[i] = await dispatch(fetchItemActions[i](pageSlug));
  }

  // Avoid dispatching duplicate actions
  const uniqueFetches = [
    ...new Set(
      Object.keys(sections)
        .map((key) => sections[key].fetchAll)
        .filter(Boolean)
    ),
  ];
  return Promise.all(
    uniqueFetches.map((fetch) => dispatch(fetch())).concat(itemActions)
  );
};

export type PageInfo = {
  editUrl?: string;
  title: string;

  /* The page is complete, and can be rendered */
  isComplete: boolean;
  actionGrant?: ActionGrant;
};

type PageRendererProps = {
  page: PageEntity;
  pageInfo: PageInfo;
};
export type PageRenderer = ComponentType<PageRendererProps>;

const PageDetail = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { pageSlug, section } = useParams<{
    pageSlug: string;
    section: string;
  }>();

  const pageHierarchy = useAppSelector((state) =>
    selectPageHierarchy(state, {
      sections,
    })
  );
  const { pageSelector, PageRenderer } = getSection(section);
  const { selectedPage, selectedPageInfo } = useAppSelector((state) =>
    pageSelector(state, {
      pageSlug,
    })
  );

  const loggedIn = useUserContext();

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchPageDetail',
    () => loadData(pageSlug, section, loggedIn, dispatch),
    [pageSlug]
  );

  if (!selectedPage) {
    return <LoadingIndicator loading />;
  }

  const { editUrl, actionGrant = [], isComplete } = selectedPageInfo;
  return (
    <Content className={styles.cont}>
      <Helmet title={selectedPageInfo.title} />
      <div className={styles.main}>
        <button
          className={styles.sidebarOpenBtn}
          onClick={() => setIsOpen(true)}
        >
          <Icon name="arrow-forward" size={30} />
        </button>
        <Flex className={styles.page}>
          <Sidebar
            pageHierarchy={pageHierarchy}
            isOpen={isOpen}
            handleClose={() => setIsOpen(false)}
          />

          <div className={styles.mainTxt}>
            <NavigationTab className={styles.navTab}>
              {actionGrant.includes('edit') && editUrl && (
                <NavigationLink to={editUrl}>Rediger</NavigationLink>
              )}
              {actionGrant.includes('create') && (
                <NavigationLink to="/pages/new">Lag ny</NavigationLink>
              )}
            </NavigationTab>

            {isComplete ? (
              <MainPageRenderer
                page={selectedPage}
                pageInfo={selectedPageInfo}
                ChildPageRenderer={PageRenderer}
              />
            ) : (
              <LoadingIndicator loading />
            )}
          </div>
        </Flex>
      </div>
    </Content>
  );
};

export default PageDetail;

export const MainPageRenderer = ({
  page,
  pageInfo,
  ChildPageRenderer,
}: PageRendererProps & {
  ChildPageRenderer: PageRenderer;
}) => {
  const pageBanner = page.logo || page.picture; // Splittet fra hverandre, var pageBanner = pic || logo

  const pageBannerPlaceholder = page.logoPlaceholder || page.picturePlaceholder;
  const { title } = pageInfo;

  return (
    <article>
      <div className={styles.headWrapper}>
        {pageBanner && (
          <div className={styles.banner}>
            <Image
              alt={`${title} page banner`}
              src={pageBanner}
              placeholder={pageBannerPlaceholder}
            />
          </div>
        )}
        {title !== 'Info om Abakus' && (
          <h1 className={styles.header1}>{readmeIfy(title)}</h1>
        )}
      </div>
      <ChildPageRenderer page={page} pageInfo={pageInfo} />
    </article>
  );
};
