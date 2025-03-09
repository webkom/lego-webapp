import { HTMLProps } from 'react';
import { Overwrite } from 'utility-types';
import { usePageContext } from 'vike-react/usePageContext';

type Props = Overwrite<
  HTMLProps<HTMLAnchorElement>,
  {
    className: string | ((options: { isActive: boolean }) => string);
  }
>;

export const Link = (props: Props) => {
  const { urlPathname } = usePageContext();
  const href = props.href ?? '';

  const isActive =
    href === '/' ? urlPathname === href : urlPathname.startsWith(href);
  const className =
    typeof props.className === 'function'
      ? props.className({ isActive })
      : props.className;
  return <a {...props} className={className} />;
};
