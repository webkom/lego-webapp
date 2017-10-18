// @flow

import React from 'react';
import { Link } from 'react-router';
import { Content } from 'app/components/Layout';

type Props = {
  pages: Array<*>
};

const PageList = ({ pages }: Props) => {
  return (
    <Content>
      <ul>
        {Object.values(pages).map(page => (
          <li key={page.pk}>
            <Link to={`/pages/${page.slug}`}>{page.title}</Link>
          </li>
        ))}
      </ul>
    </Content>
  );
};

export default PageList;
