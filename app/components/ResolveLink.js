// @flow

import * as React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  link: [string, React.Node]
};

const ResolveLink = ({ link: [href, name], ...props }: Props) => {
  if (href.startsWith('https://') || href.startsWith('http://')) {
    return (
      <a {...props} href={href}>
        {name}
      </a>
    );
  }

  return (
    <Link {...props} to={href}>
      {name}
    </Link>
  );
};

export default ResolveLink;
