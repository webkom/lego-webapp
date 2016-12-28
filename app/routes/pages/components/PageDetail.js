import React from 'react';
import styles from './PageDetail.css';
import LoadingIndicator from 'app/components/LoadingIndicator';
import Markdown from 'app/components/Markdown';

export type Props = {
  page: Object;
};

const PageDetail = ({ page }: props) => {
  if (!page.slug) {
    return <LoadingIndicator loading />;
  }

  return (
    <div className={styles.root}>
      <article className={styles.page}>
        <h2 className={styles.title}>{page.title}</h2>
        <Markdown>{page.content}</Markdown>
      </article>
    </div>
  );
};

export default PageDetail;
