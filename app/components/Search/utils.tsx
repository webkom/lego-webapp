import ReadmeLogo from 'app/components/ReadmeLogo';
import type { Allowed } from 'app/reducers/allowed';
import type { ReactNode } from 'react';

type Link = {
  key: string;
  title: ReactNode;
  url: string;
  admin?: boolean;
  requireLogin?: boolean;
};

const LINKS: Array<Link> = [
  {
    key: 'profile',
    requireLogin: true,
    title: 'Profil',
    url: '/users/me',
  },
  {
    key: 'contact',
    requireLogin: true,
    title: 'Kontakt Abakus',
    url: '/contact',
  },
  {
    key: 'articles',
    title: 'Artikler',
    url: '/articles',
  },
  {
    key: 'events',
    title: 'Arrangementer',
    url: '/events',
  },
  {
    key: 'aboutUs',
    title: 'Om Abakus',
    url: '/pages/info-om-abakus',
  },
  {
    key: 'readme',
    title: <ReadmeLogo />,
    url: 'https://readme.abakus.no',
  },
  {
    key: 'interest-groups',
    title: 'Interessegrupper',
    url: '/interest-groups',
  },
  {
    key: 'galleries',
    title: 'Bilder',
    url: '/photos',
  },
  {
    key: 'meetings',
    title: 'Møter',
    url: '/meetings',
  },
  {
    key: 'quotes',
    title: 'Overhørt',
    url: '/quotes/',
  },
  {
    key: 'companies',
    title: 'Bedrifter',
    url: '/companies',
  },
  {
    key: 'jobListings',
    title: 'Jobbannonser',
    url: '/joblistings',
  },
  {
    key: 'tags',
    title: 'Tags',
    url: '/tags',
  },
  {
    key: 'polls',
    title: 'Avstemninger',
    url: '/polls',
  },
  {
    admin: true,
    key: 'announcements',
    title: 'Kunngjøringer',
    url: '/announcements',
  },
  {
    admin: true,
    key: 'bdb',
    title: 'Bedriftsdatabase',
    url: '/bdb',
  },
  {
    admin: true,
    key: 'groups',
    title: 'Grupper',
    url: '/admin/groups',
  },
  {
    admin: true,
    key: 'email',
    title: 'E-post',
    url: '/admin/email',
  },
  {
    admin: true,
    key: 'surveys',
    title: 'Spørreundersøkelser',
    url: '/surveys',
  },
  {
    admin: true,
    key: 'statistics',
    title: 'Statistikk',
    url: '/statistics',
  },
];

const sortFn = (a, b) => {
  // Sort non-strings last:
  if (typeof a.title !== 'string') {
    return 1;
  }

  if (typeof b.title !== 'string') {
    return -1;
  }

  return a.title.localeCompare(b.title);
};

const SORTED_REGULAR = LINKS.filter((link) => !link.admin).sort(sortFn);
const SORTED_ADMIN = LINKS.filter((link) => link.admin).sort(sortFn);
type Options = {
  allowed: Allowed;
  loggedIn: boolean;
};

/**
 * Finds the links that the user should be able to see.
 */
function retrieveAllowed(links: Array<Link>, { allowed, loggedIn }: Options) {
  return links
    .filter(({ key, requireLogin }) => {
      // If we have a mapping for this from the server, check that:
      if (Object.prototype.hasOwnProperty.call(allowed, key)) {
        return allowed[key];
      }

      // Otherwise check if we're logged in if this requires login:
      return !requireLogin || loggedIn;
    })
    .map(({ url, title }) => [url, title]) as NavigationLink[];
}

export type NavigationLink = [string, ReactNode]; // [url, label(as a react-node)]

export function getRegularLinks(options: Options): Array<NavigationLink> {
  return retrieveAllowed(SORTED_REGULAR, options);
}
export function getAdminLinks(options: Options): Array<NavigationLink> {
  return retrieveAllowed(SORTED_ADMIN, options);
}
export const stripHtmlTags = (s: string): string => {
  return s.replace(/<(.|\n)*?>/g, '');
};
