/* eslint-disable react/no-danger */
// @flow

import React, { Component, type Node } from 'react';
import styles from './PageDetail.css';
import { Flex } from 'app/components/Layout';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { Content } from 'app/components/Content';
import { readmeIfy } from 'app/components/ReadmeLogo';
import DisplayContent from 'app/components/DisplayContent';
import GroupMember from 'app/components/GroupMember';
import Icon from 'app/components/Icon';

import type { HierarchySectionEntity } from './PageHierarchy';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import type { PageEntity } from 'app/reducers/pages';
import Sidebar from './Sidebar';

export type PageInfo = {
  editUrl?: string,
  title: string,
  /* The page is complete, and can be rendered */
  isComplete: boolean,
  actionGrant?: Array<string>
};

export const MainPageRenderer = ({
  page,
  pageInfo,
  ChildPageRenderer
}: {
  page: Object,
  pageInfo: Object,
  ChildPageRenderer: ({ page: any }) => Node
}) => {
  const pageBanner = page.logo || page.picture;
  const { title } = pageInfo;

  return (
    <article className={styles.pageWrapper}>
      {pageBanner && (
        <div className={styles.logo}>
          <img alt={`${title} page banner`} src={pageBanner} />
        </div>
      )}
      {title !== 'About' && (
        <h1 className={styles.header1}>{readmeIfy(title)}</h1>
      )}
      <ChildPageRenderer page={page} pageInfo={pageInfo} />
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

  const { leader: leaders = [], member: members = [] } = membershipsByRole;

  return (
    <article className={styles.detail}>
      <DisplayContent content={text} />

      <h3 className={styles.heading}>MEDLEMMER</h3>
      <div className={styles.membersSection}>
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
        <div className={styles.members}>
          {members.map(({ user, profilePicture }, key) => (
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

type State = {
  isOpen: boolean
};

type Props = {
  selectedPage: any,
  currentUrl: string,
  selectedPageInfo: PageInfo,
  PageRenderer: ({ page: any }) => Node,
  pageHierarchy: Array<HierarchySectionEntity>
};

class PageDetail extends Component<Props, State> {
  state = {
    isOpen: false
  };

  openSidebar = () =>
    this.setState({
      isOpen: true
    });

  closeSidebar = () =>
    this.setState({
      isOpen: false
    });

  render() {
    const {
      selectedPage,
      selectedPageInfo,
      pageHierarchy,
      PageRenderer,
      currentUrl
    } = this.props;

    if (!selectedPage) {
      return <LoadingIndicator loading />;
    }
    const { editUrl, actionGrant = [], isComplete } = selectedPageInfo;
    const { category } = selectedPage;

    return (
      <Content className={styles.cont}>
        <div className={styles.main}>
          <button className={styles.sidebarOpenBtn} onClick={this.openSidebar}>
            <Icon size={30} name="arrow-forward" />
          </button>
          <Flex className={styles.page} wrap>
            <Sidebar
              categorySelected={category}
              currentUrl={currentUrl}
              pageHierarchy={pageHierarchy}
              isOpen={this.state.isOpen}
              handleClose={this.closeSidebar}
            />

            <div className={styles.mainTxt}>
              <NavigationTab>
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
