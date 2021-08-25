/* eslint-disable react/no-danger */
// @flow

import type { Node } from 'react';

import { Helmet } from 'react-helmet';
import { Component } from 'react';
import styles from './PageDetail.css';
import { Flex } from 'app/components/Layout';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { Content } from 'app/components/Content';
import { readmeIfy } from 'app/components/ReadmeLogo';
import DisplayContent from 'app/components/DisplayContent';
import GroupMember from 'app/components/GroupMember';
import Icon from 'app/components/Icon';
import { Image } from 'app/components/Image';

import type { HierarchySectionEntity } from './PageHierarchy';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import type { PageEntity } from 'app/reducers/pages';
import Sidebar from './Sidebar';

type State = {
  isOpen: boolean,
};

export type PageInfo = {
  editUrl?: string,
  title: string,
  /* The page is complete, and can be rendered */
  isComplete: boolean,
  actionGrant?: Array<string>,
};

type Props = {
  selectedPage: any,
  currentUrl: string,
  selectedPageInfo: PageInfo,
  PageRenderer: ({ page: any }) => Node,
  pageHierarchy: Array<HierarchySectionEntity>,
  loggedIn: boolean,
};

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
            <Icon size={30} name="arrow-forward" />
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
                  <NavigationLink to={editUrl}>Endre</NavigationLink>
                )}
                {actionGrant.includes('create') && (
                  <NavigationLink to="/pages/new">Ny</NavigationLink>
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
}: {
  page: Object,
  pageInfo: Object,
  ChildPageRenderer: ({ page: any }) => Node,
  loggedIn: boolean,
}) => {
  const pageBanner = page.logo || page.picture; //Splittet fra hverandre, var pageBanner = pic || logo
  const { title } = pageInfo;

  return (
    <article className={styles.pageWrapper}>
      <div className={styles.headWrapper}>
        {pageBanner && (
          <div className={styles.banner}>
            <Image alt={`${title} page banner`} src={pageBanner} />
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

export const FlatpageRenderer = ({ page }: { page: PageEntity }) => (
  <article className={styles.detail}>
    <DisplayContent content={page.content} />
  </article>
);

export const GroupRenderer = ({ page }: { page: Object }) => {
  const { membershipsByRole, text } = page;

  const {
    leader: leaders = [],
    'co-leader': co_leaders = [],
    member: members = [],
    active_retiree: activeRetirees = [],
  } = membershipsByRole;

  return (
    <article className={styles.detail}>
      <DisplayContent content={text} />

      <h3 className={styles.heading}>MEDLEMMER</h3>
      <div className={styles.membersSection}>
        <div className={styles.leaderBoard}>
          <div className={styles.leader}>
            {leaders.map(({ user, profilePicture }, key) => (
              <GroupMember
                user={user}
                profilePicture={profilePicture}
                key={key}
                leader
              />
            ))}
          </div>
          <div className={styles.co_leader}>
            {co_leaders.map(({ user, profilePicture }, key) => (
              <GroupMember
                user={user}
                profilePicture={profilePicture}
                key={key}
                co_leader
              />
            ))}
          </div>
        </div>
        <div className={styles.members}>
          {members.map(({ user, profilePicture }, key) => (
            <GroupMember
              user={user}
              profilePicture={profilePicture}
              key={key}
            />
          ))}
        </div>
        <div className={styles.members}>
          {activeRetirees.map(({ user, profilePicture }, key) => (
            <GroupMember
              user={user}
              profilePicture={profilePicture}
              key={key}
            />
          ))}
        </div>
      </div>
    </article>
  );
};
