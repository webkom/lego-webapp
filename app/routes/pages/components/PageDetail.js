/* eslint-disable react/no-danger */
// @flow

import React, { Component, type Node } from 'react';
import styles from './PageDetail.css';
import { Flex } from 'app/components/Layout';
import LoadingIndicator from 'app/components/LoadingIndicator';
import PageHierarchy from './PageHierarchy';
import { Content } from 'app/components/Content';
import { readmeIfy } from 'app/components/ReadmeLogo';
import DisplayContent from 'app/components/DisplayContent';
import GroupMember from 'app/components/GroupMember';
import Icon from 'app/components/Icon';
import cx from 'classnames';

import type { HierarchySectionEntity } from './PageHierarchy';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import type { PageEntity } from 'app/reducers/pages';

export type PageInfo = {
  editUrl?: string,
  title: string,
  /* The page is complete, and can be rendered */
  isComplete: boolean,
  actionGrant?: Array<string>
};

type Props<T> = {
  selectedPage: T,
  currentUrl: string,
  selectedPageInfo: PageInfo,
  PageRenderer: ({ page: T }) => Node,
  pageHierarchy: Array<HierarchySectionEntity>
};

export const MainPageRenderer = ({
  page,
  pageInfo,
  ChildPageRenderer
}: {
  page: Object,
  pageInfo: Object,
  ChildPageRenderer: ({ page: T }) => Node
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
      <h1 className={styles.header1}>{readmeIfy(title)}</h1>
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
  const { membershipsByRole, text, logo } = page;

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

class Sidebar extends Component {
  render() {
    const {
      categorySelected,
      currentUrl,
      pageHierarchy,
      isOpen,
      handleClose
    } = this.props;
    const pictureLabel = 'Listingløpet 1985';

    return (
      <div
        className={isOpen ? styles.sidebarWrapper : undefined}
        onClick={handleClose}
      >
        <div
          className={cx(styles.side, isOpen && styles.isOpen)}
          onClick={event => {
            // Ask someone about this (or just use gogle) <3
            event.stopPropagation();
          }}
        >
          <aside className={styles.sidebar}>
            <div className={styles.sidebarTop}>
              <h3 className={styles.sidebarHeader}>Om Abakus</h3>
              <h4 className={styles.sidebarSubtitle}>{categorySelected}</h4>

              <div className={styles.sidebarPicture}>
                <h4 className={styles.pictureHeader}> {"Abakus' Fortid"}</h4>
                <a href="https://abakus.no/photos/183/picture/460">
                  <img
                    alt={pictureLabel}
                    className={styles.oldImg}
                    src="https://thumbor.abakus.no/BT--sOMt9dTlSr93y_D3fCso9YE=/0x700/smart/scan713_OcOF51m.jpg"
                  />
                  <span className={styles.pictureInfo}>{pictureLabel}</span>
                </a>
              </div>
            </div>

            <div className={styles.sidebarBottom}>
              <PageHierarchy
                pageHierarchy={pageHierarchy}
                currentUrl={currentUrl}
              />
            </div>
          </aside>
        </div>
      </div>
    );
  }
}

type State = {
  isOpen: boolean
};

class PageDetail extends Component<Props<T>, State> {
  state = {
    isOpen: true
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
      currentUrl,
      ...rest
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
