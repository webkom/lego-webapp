// @flow
import type { Allowed } from 'app/reducers/allowed';

type Link = {|
  key: string,
  title: string,
  url: string,
  admin?: boolean,
  requireLogin?: boolean
|};

const LINKS: Array<Link> = [
  {
    key: 'profile',
    requireLogin: true,
    title: 'Profil',
    url: '/users/me'
  },
  {
    key: 'contact',
    requireLogin: true,
    title: 'Kontakt Abakus',
    url: '/contact'
  },
  {
    key: 'articles',
    title: 'Artikler',
    url: '/articles'
  },
  {
    key: 'events',
    title: 'Arrangementer',
    url: '/events'
  },
  {
    key: 'aboutUs',
    title: 'Om Abakus',
    url: '/pages/info/om-oss'
  },
  {
    key: 'readme',
    title: 'readme',
    url: 'https://readme.abakus.no'
  },
  {
    key: 'interestGroups',
    title: 'Interessegrupper',
    url: '/interestgroups'
  },
  {
    key: 'photos',
    title: 'Bilder',
    url: '/photos'
  },
  {
    key: 'meetings',
    title: 'Møter',
    url: '/meetings'
  },
  {
    key: 'quotes',
    title: 'Sitater',
    url: '/quotes'
  },
  {
    key: 'companies',
    title: 'Bedrifter',
    url: '/companies'
  },
  {
    key: 'jobListings',
    title: 'Jobbannonser',
    url: '/joblistings'
  },
  /*
  TODO: Add surveys back in when the feature is done
  {
    admin: true,
    key: 'surveys',
    title: 'Undersøkelser',
    url: '/surveys'
  },
  */
  {
    admin: true,
    key: 'announcements',
    title: 'Kunngjøringer',
    url: '/announcements'
  },
  {
    admin: true,
    key: 'bdb',
    title: 'Bedriftsdatabase',
    url: '/bdb'
  },
  {
    admin: true,
    key: 'groups',
    title: 'Grupper',
    url: '/admin/groups'
  },
  {
    admin: true,
    key: 'email',
    title: 'E-post',
    url: '/admin/email'
  }
];

const SORTED_REGULAR = LINKS.filter(link => !link.admin).sort((a, b) =>
  a.title.localeCompare(b.title)
);

const SORTED_ADMIN = LINKS.filter(link => link.admin).sort((a, b) =>
  a.title.localeCompare(b.title)
);

type Options = { allowed: Allowed, loggedIn: boolean };

/**
 * Finds the links that the user should be able to see.
 */
function retrieveAllowed(links: Array<Link>, { allowed, loggedIn }: Options) {
  return links
    .filter(({ key, requireLogin }) => {
      // If we have a mapping for this from the server, check that:
      if (allowed.hasOwnProperty(key)) {
        return allowed[key];
      }

      // Otherwise check if we're logged in if this requires login:
      return !requireLogin || loggedIn;
    })
    .map(({ url, title }) => [url, title]);
}

type NavigationLink = [string, string]; // [url, label]

export function getRegularLinks(options: Options): Array<NavigationLink> {
  return retrieveAllowed(SORTED_REGULAR, options);
}

export function getAdminLinks(options: Options): Array<NavigationLink> {
  return retrieveAllowed(SORTED_ADMIN, options);
}
