// @flow

import React from 'react';
import styles from './PageDetail.css';
import LoadingIndicator from 'app/components/LoadingIndicator';
import Markdown from 'app/components/Markdown';
import PageHierarchy from './PageHierarchy';

type Props = {
  page: Object,
  parent: Object,
  siblings: Object[]
};

const PageDetail = ({ page, ...props }: Props) => {
  if (!page.content) {
    return <LoadingIndicator loading />;
  }

  return (
    <div className={styles.root}>
      <div className={styles.page}>
        <article className={styles.detail}>
          <h2 className={styles.title}>{page.title}</h2>
          <Markdown>{page.content}</Markdown>
        </article>
        <aside className={styles.sidebar}>
          <PageHierarchy
            {...props}
            selectedSlug={page.slug}
          />
        </aside>
      </div>
    </div>
  );
};

export default PageDetail;
