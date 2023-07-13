/* eslint-disable react/no-danger */
import { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import { Content } from 'app/components/Content';
import DisplayContent from 'app/components/DisplayContent';
import GroupMember from 'app/components/GroupMember';
import Icon from 'app/components/Icon';
import { Image } from 'app/components/Image';
import { Flex } from 'app/components/Layout';
import LoadingIndicator from 'app/components/LoadingIndicator';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import { readmeIfy } from 'app/components/ReadmeLogo';
import type { ActionGrant } from 'app/models';
import type { PageEntity } from 'app/reducers/pages';
import styles from './PageDetail.css';
import Sidebar from './Sidebar';
import type { HierarchySectionEntity } from './PageHierarchy';
import type { ComponentType } from 'react';

type State = {
  isOpen: boolean;
};
export type PageInfo = {
  editUrl?: string;
  title: string;

  /* The page is complete, and can be rendered */
  isComplete: boolean;
  actionGrant?: ActionGrant;
};
type Props = {
  selectedPage: any;
  currentUrl: string;
  selectedPageInfo: PageInfo;
  PageRenderer: PageRenderer;
  pageHierarchy: HierarchySectionEntity[];
  loggedIn: boolean;
};

type PageRendererProps = {
  page: PageEntity;
  pageInfo: PageInfo;
  loggedIn: boolean;
};
export type PageRenderer = ComponentType<PageRendererProps>;

class PageDetail extends Component<Props, State> {
  state = {
    isOpen: false,
  };
  openSidebar = () =>
    this.setState({
      isOpen: true,
    });
  closeSidebar = () =>
    this.setState({
      isOpen: false,
    });

  render() {
    const {
      selectedPage,
      selectedPageInfo,
      pageHierarchy,
      PageRenderer,
      currentUrl,
      loggedIn,
    } = this.props;

    if (!selectedPage) {
      return <LoadingIndicator loading />;
    }

    const { editUrl, actionGrant = [], isComplete } = selectedPageInfo;
    const { category } = selectedPage;
    return (
      <Content className={styles.cont}>
        <Helmet title={selectedPageInfo.title} />
        <div className={styles.main}>
          <button className={styles.sidebarOpenBtn} onClick={this.openSidebar}>
            <Icon name="arrow-forward" size={30} />
          </button>
          <Flex className={styles.page}>
            <Sidebar
              categorySelected={category}
              currentUrl={currentUrl}
              pageHierarchy={pageHierarchy}
              isOpen={this.state.isOpen}
              handleClose={this.closeSidebar}
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
                  loggedIn={loggedIn}
                />
              ) : (
                <LoadingIndicator loading />
              )}
            </div>
          </Flex>
        </div>
      </Content>
    );
  }
}

export default PageDetail;

export const MainPageRenderer = ({
  page,
  pageInfo,
  ChildPageRenderer,
  loggedIn,
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
      <ChildPageRenderer page={page} pageInfo={pageInfo} loggedIn={loggedIn} />
    </article>
  );
};

export const FlatpageRenderer: PageRenderer = ({ page }) => (
  <article className={styles.detail}>
    <DisplayContent content={page.content} />
  </article>
);

export const GroupRenderer: PageRenderer = ({ page }) => {
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
