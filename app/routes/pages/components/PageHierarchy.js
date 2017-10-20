// @flow

import React from 'react';
import { Link } from 'react-router';
import styles from './PageHierarchy.css';

export type HierarchyEntity = {
  title: string,
  url: string
};

export type HierarchySectionEntity = {
  title: string,
  items: HierarchyEntity[]
};

type Props = {
  pageHierarchy: Array<HierarchySectionEntity>,
  currentUrl: string
};

const HierarchySection = ({
  hierarchySection: { title, items },
  currentUrl
}: {
  hierarchySection: HierarchySectionEntity,
  currentUrl: string
}) => (
  <ul className={styles.pageList}>
    {items.length > 0 && (
      <li key="title">
        <p className={styles.header}>{title}</p>
      </li>
    )}
    {items.map((item, key) => (
      <li key={key}>
        <Link
          style={{
            fontWeight: item.url === currentUrl ? 'bold' : 'normal'
          }}
          to={item.url}
        >
          {item.title}
        </Link>
      </li>
    ))}
  </ul>
);

const PageHierarchy = ({ pageHierarchy, currentUrl }: Props) => {
  return (
    <div className={styles.sidebar}>
      {pageHierarchy.map((section, key) => (
        <HierarchySection
          hierarchySection={section}
          key={key}
          currentUrl={currentUrl}
        />
      ))}
    </div>
  );
};

export default PageHierarchy;
