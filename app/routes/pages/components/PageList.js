// @flow

import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';
import styles from './PageHierarchy.css';
import Icon from 'app/components/Icon';

type Props = {
  pages: Object[]
};

const PageList = ({ pages }: Props) => {
  console.log('render PageList', pages);
  return (
    <ul>
      {Object.values(pages).map(page => (
        <li key={page.pk}>
          <Link to={`/pages/${page.slug}`}>{page.title}</Link>
        </li>
      ))}
    </ul>
  );
};

export default PageList;
