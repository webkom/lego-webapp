import { Tab } from '@webkom/lego-bricks';
import qs from 'qs';
import { useLocation } from 'react-router-dom';
import type { ParsedQs } from 'qs';
import type { ReactNode } from 'react';
import type { Location } from 'react-router-dom';

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
  location: Location,
  matchQuery: boolean | Record<string, QueryValue | QueryValue[]>,
  matchSubpages: boolean,
) => {
  let currentPath = location.pathname;
  if (matchQuery === true) {
    currentPath += location.search;
  } else {
    activeUrls = activeUrls.map((url) => url.split('?')[0]);
  }
  if (typeof matchQuery === 'object') {
    const query = qs.parse(location.search, { ignoreQueryPrefix: true });
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
  const activePaths = [href, ...(additionalActivePaths || [])];
  const location = useLocation();
  const active = isActivePath(activePaths, location, matchQuery, matchSubpages);

  return (
    <Tab href={href} active={active} disabled={disabled}>
      {children}
    </Tab>
  );
};
