// @flow

import React from 'react';
import { Link } from 'react-router-dom';
import { Content } from 'app/components/Content';

type Page = {
  slug: string,
  title: string,
  pk: number
};

type Props = {
  pages: { [key: string]: Page }
};

const PageList = ({ pages }: Props) => {
  return (
    <Content>
      <ul>
        {Object.keys(pages).map(id => {
          const page = pages[id];
          return (
            <li key={page.pk}>
              <Link to={`/pages/${page.slug}`}>{page.title}</Link>
            </li>
          );
        })}
      </ul>
    </Content>
  );
};

export default PageList;
