// @flow

import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';
import styles from './PageHierarchy.css';
import Icon from 'app/components/Icon';

type Props = {
  parent?: { slug: string, title: string },
  siblings: Object[],
  selectedSlug: string
};

const PageHierarchy = ({ parent, siblings, selectedSlug }: Props) => {
  if (!parent) return null;
  return (
    <div className={styles.sidebar}>
      <ul className={styles.pageList}>
        <li>
          <Link className={styles.back} to={`/pages/${parent.slug}`}>
            <Icon name="chevron-left" />
            {parent.title}
          </Link>
        </li>
        {siblings.map(page => (
          <li
            key={page.pk}
            className={classNames(styles.sibling, {
              selected: page.slug === selectedSlug
            })}
          >
            <Link to={`/pages/${page.slug}`}>
              {page.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PageHierarchy;
