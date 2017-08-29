import React from 'react';
import { Link } from 'react-router';

const ResolveLink = ({ link: [href, name], ...props }: Object) => {
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
