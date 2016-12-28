import React from 'react';
import styles from './PageDetail.css';
import LoadingIndicator from 'app/components/LoadingIndicator';

export type Props = {
  page: Object;
};

const PageDetail = ({ page }: props) => {
  if (!page.slug) {
    return <LoadingIndicator loading />;
  }

  return (
    <div className={styles.root}>
      <h2>{page.title}</h2>
      <p>{page.content}</p>
    </div>
  );
};

export default PageDetail;
