/* eslint-disable react/no-danger */
// @flow

import React, { type Node } from 'react';
import styles from './PageDetail.css';
import { Link } from 'react-router';
import { Flex } from 'app/components/Layout';
import LoadingIndicator from 'app/components/LoadingIndicator';
import PageHierarchy from './PageHierarchy';
import { Content } from 'app/components/Layout';
import sortBy from 'lodash/sortBy';
import DisplayContent from 'app/components/DisplayContent';

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

const RenderUser = ({ user }: Object) => (
  <Link to={`/users/${user.username}`}>{user.fullName}</Link>
);

export const GroupRenderer = ({ page }: { page: Object }) => {
  const { memberships, text, logo } = page;
  const leader = memberships.find(membership => membership.role == 'leader');

  const members = sortBy(
    memberships.filter(m => m != leader).map(m => m.user),
    'fullName'
  );
  return (
    <article className={styles.detail}>
      {logo && (
        <div className={styles.logo}>
          <img alt="presentation" src={logo} />
        </div>
      )}
      <DisplayContent content={text} />

      <h3>Medlemmer:</h3>
      <ul>
        {leader && <li>Leder: {<RenderUser user={leader.user} />}</li>}
        {members.map((member, key) => (
          <li key={key}>
            <RenderUser user={member} />
          </li>
        ))}
      </ul>
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
      <NavigationTab title={title}>
        {actionGrant.includes('edit') &&
          editUrl && <NavigationLink to={`${editUrl}`}>ENDRE</NavigationLink>}
        {actionGrant.includes('create') && (
          <NavigationLink to={`/pages/new`}> NY </NavigationLink>
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
