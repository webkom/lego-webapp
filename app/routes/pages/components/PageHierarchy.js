// @flow

import React from 'react';
import { Link } from 'react-router';
import styles from './PageHierarchy.css';

export type HierarchyEntity = {
  title: string,
  id: number | string,
  url: string
};

export type HierarchySectionEntity = {
  title: string,
  items: HierarchyEntity[]
};

type Props = {
  pageHierarchy: Array<HierarchySectionEntity>,
  /* Is object because it will only be used for comparison */
  selectedItem: Object
};

const HierarchySection = ({
  hierarchySection: { title, items },
  selectedItem
}: {
  hierarchySection: HierarchySectionEntity,
  selectedItem: Object
}) => (
  <ul className={styles.pageList}>
    <li>
      <p className={styles.header}>{title}</p>
    </li>
    {items.map(item => (
      <li key={item.id}>
        <Link
          style={{
            fontWeight: item === selectedItem ? 'bold' : 'normal'
          }}
          to={item.url}
        >
          {item.title}
        </Link>
      </li>
    ))}
  </ul>
);

const PageHierarchy = ({ pageHierarchy, selectedItem }: Props) => {
  return (
    <div className={styles.sidebar}>
      {pageHierarchy.map((section, key) => (
        <HierarchySection
          hierarchySection={section}
          key={key}
          selectedItem={selectedItem}
        />
      ))}
    </div>
  );
};

export default PageHierarchy;
