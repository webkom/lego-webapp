// @flow

import React from 'react';
import { Link } from 'react-router';

type Props = {
  pages: Object[]
};

const PageList = ({ pages }: Props) => {
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
