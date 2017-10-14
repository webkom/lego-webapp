/* eslint-disable react/no-danger */
// @flow

import * as React from 'react';
import styles from './PageDetail.css';
import { Flex } from 'app/components/Layout';
import LoadingIndicator from 'app/components/LoadingIndicator';
import PageHierarchy from './PageHierarchy';

import type { HierarchySectionEntity } from './PageHierarchy';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import type { PageEntity } from 'app/reducers/pages';

export type PageInfo = {
  editUrl: string,
  title: string,
  actionGrant: string[]
};
type Props<T> = {
  selectedPage: T,
  currentUrl: string,
  selectedPageInfo: PageInfo,
  PageRenderer: ({ page: T }) => React.Element<*>,
  pageHierarchy: HierarchySectionEntity[]
};

export const FlatpageRenderer = ({ page }: { page: PageEntity }) => (
  <article className={styles.detail}>
    {page.picture && (
      <div className={styles.coverImage}>
        <img alt="presentation" src={page.picture} />
      </div>
    )}
    <div dangerouslySetInnerHTML={{ __html: page.content }} />
  </article>
);

export const GroupRenderer = ({ page }: { page: Object }) => (
  <article className={styles.detail}>
    {page.logo && (
      <div className={styles.logo}>
        <img alt="presentation" src={page.logo} />
      </div>
    )}

    <div dangerouslySetInnerHTML={{ __html: page.description }} />
    <div dangerouslySetInnerHTML={{ __html: page.text }} />
  </article>
);

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
  const { title, editUrl, actionGrant } = selectedPageInfo;
  return (
    <div className={styles.root}>
      <NavigationTab title={title}>
        {actionGrant.includes('edit') && (
          <NavigationLink to={`${editUrl}`}>ENDRE</NavigationLink>
        )}
        {actionGrant.includes('create') && (
          <NavigationLink to={`/pages/create`}> NY </NavigationLink>
        )}
      </NavigationTab>
      <Flex className={styles.page}>
        <PageRenderer page={selectedPage} />

        <aside className={styles.sidebar}>
          <PageHierarchy
            pageHierarchy={pageHierarchy}
            currentUrl={currentUrl}
          />
        </aside>
      </Flex>
    </div>
  );
}
export default PageDetail;
