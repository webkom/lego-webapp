/* eslint-disable react/no-danger */
// @flow

import React, { type Node } from 'react';
import styles from './PageDetail.css';
import { Flex } from 'app/components/Layout';
import LoadingIndicator from 'app/components/LoadingIndicator';
import PageHierarchy from './PageHierarchy';
import { Content } from 'app/components/Content';
import { readmeIfy } from 'app/components/ReadmeLogo';
import DisplayContent from 'app/components/DisplayContent';
import GroupMember from 'app/components/GroupMember';

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

export const FlatpageRenderer = ({ page }: { page: PageEntity }) => (
  <article className={styles.detail}>
    {page.picture && (
      <div className={styles.coverImage}>
        <img alt="presentation" src={page.picture} />
      </div>
    )}
    <DisplayContent content={page.content} />
  </article>
);

export const GroupRenderer = ({ page }: { page: Object }) => {
  const { membershipsByRole, text, logo } = page;

  const { leader: leaders = [], member: members = [] } = membershipsByRole;

  return (
    <article className={styles.detail}>
      {logo && (
        <div className={styles.logo}>
          <img alt="presentation" src={logo} />
        </div>
      )}
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

function PageDetail<T: Object>({
  selectedPage,
  selectedPageInfo,
  pageHierarchy,
  PageRenderer,
  currentUrl
}: Props<T>) {
  if (!selectedPage) {
    return <LoadingIndicator loading />;
  }
  const { title, editUrl, actionGrant = [], isComplete } = selectedPageInfo;
  return (
    <Content>
      <NavigationTab title={readmeIfy(title)}>
        {actionGrant.includes('edit') && editUrl && (
          <NavigationLink to={editUrl}>Endre</NavigationLink>
        )}
        {actionGrant.includes('create') && (
          <NavigationLink to="/pages/new">Ny</NavigationLink>
        )}
      </NavigationTab>
      <Flex className={styles.page} wrap>
        {isComplete ? (
          <PageRenderer page={selectedPage} />
        ) : (
          <LoadingIndicator loading />
        )}
        <aside className={styles.sidebar}>
          <PageHierarchy
            pageHierarchy={pageHierarchy}
            currentUrl={currentUrl}
          />
        </aside>
      </Flex>
    </Content>
  );
}
export default PageDetail;
