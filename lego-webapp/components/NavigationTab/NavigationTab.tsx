import { Tab } from '@webkom/lego-bricks';
import qs from 'qs';
import { PageContextClient } from 'vike/types';
import { usePageContext } from 'vike-react/usePageContext';
import type { ParsedQs } from 'qs';
import type { ReactNode } from 'react';

type QueryValue = ParsedQs[string];

type Props = {
  href: string;
  disabled?: boolean;
  matchQuery?: boolean | Record<string, QueryValue | QueryValue[]>;
  additionalActivePaths?: string[];
  matchSubpages?: boolean;
  children: ReactNode;
};

const isActivePath = (
  activeUrls: string[],
  url: PageContextClient['urlParsed'],
  matchQuery: boolean | Record<string, QueryValue | QueryValue[]>,
  matchSubpages: boolean,
) => {
  let currentPath = url.pathname;
  if (matchQuery === true) {
    currentPath += url.searchOriginal;
  } else {
    activeUrls = activeUrls.map((url) => url.split('?')[0]);
  }
  if (typeof matchQuery === 'object') {
    const query = qs.parse(url.searchOriginal, { ignoreQueryPrefix: true });
    for (const [key, value] of Object.entries(matchQuery)) {
      const valueList = Array.isArray(value) ? value : [value];
      if (!valueList.includes(query[key])) {
        return false;
      }
    }
  }
  const regex = /\/+$/i; // Regex to remove trailing / for comparison
  const normalizedCurrentPath = currentPath.replace(regex, '');

  if (matchSubpages) {
    return activeUrls.some((activeUrl) =>
      normalizedCurrentPath.startsWith(activeUrl),
    );
  } else {
    return activeUrls.some((activeUrl) => normalizedCurrentPath === activeUrl);
  }
};

export const NavigationTab = ({
  href,
  disabled,
  matchQuery = false,
  additionalActivePaths,
  matchSubpages = false,
  children,
}: Props) => {
  const { urlParsed } = usePageContext();
  const activePaths = [href, ...(additionalActivePaths || [])];
  const active = isActivePath(
    activePaths,
    urlParsed,
    matchQuery,
    matchSubpages,
  );

  return (
    <Tab href={href} active={active} disabled={disabled}>
      {children}
    </Tab>
  );
};
