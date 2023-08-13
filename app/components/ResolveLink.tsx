import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

type Props = {
  link: [string, ReactNode];
};

const ResolveLink = ({
  link: [href, name],
  ...props
}: Props & React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
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
