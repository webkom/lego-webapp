import ReadmeLogo from 'app/components/ReadmeLogo';
import TextWithIcon from '../TextWithIcon';
import styles from './Search.css';
import type { Allowed } from 'app/reducers/allowed';
import type { ReactNode } from 'react';

type Link = {
  key: string;
  title: ReactNode;
  url: string;
  admin?: boolean;
  requireLogin?: boolean;
  icon?: string;
};

const LINKS: Array<Link> = [
  {
    key: 'profile',
    requireLogin: true,
    title: 'Profil',
    icon: 'person-circle-outline',
    url: '/users/me',
  },
  {
    key: 'contact',
    requireLogin: true,
    title: 'Kontakt Abakus',
    icon: 'call-outline',
    url: '/contact',
  },
  {
    key: 'articles',
    title: 'Artikler',
    icon: 'book-outline',
    url: '/articles',
  },
  {
    key: 'events',
    title: 'Arrangementer',
    icon: 'calendar-outline',
    url: '/events',
  },
  {
    key: 'aboutUs',
    title: 'Om Abakus',
    icon: 'information-circle-outline',
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
    icon: 'telescope-outline',
    url: '/interest-groups',
  },
  {
    key: 'galleries',
    title: 'Album',
    icon: 'image-outline',
    url: '/photos',
  },
  {
    key: 'meetings',
    title: 'Møter',
    icon: 'people-outline',
    url: '/meetings',
  },
  {
    key: 'quotes',
    title: 'Overhørt',
    icon: 'chatbubble-ellipses-outline',
    url: '/quotes/',
  },
  {
    key: 'companies',
    title: 'Bedrifter',
    icon: 'briefcase-outline',
    url: '/companies',
  },
  {
    key: 'jobListings',
    title: 'Jobbannonser',
    icon: 'newspaper-outline',
    url: '/joblistings',
  },
  {
    key: 'tags',
    title: 'Tags',
    icon: 'pricetags-outline',
    url: '/tags',
  },
  {
    key: 'polls',
    title: 'Avstemninger',
    icon: 'stats-chart-outline',
    url: '/polls',
  },
  {
    key: 'lending',
    title: 'Utlån',
    icon: 'cart-outline',
    url: '/lending',
  },
  {
    admin: true,
    key: 'announcements',
    title: 'Kunngjøringer',
    icon: 'megaphone-outline',
    url: '/announcements',
  },
  {
    admin: true,
    key: 'bdb',
    title: 'Bedriftsdatabase',
    icon: 'file-tray-stacked-outline',
    url: '/bdb',
  },
  {
    admin: true,
    key: 'groups',
    title: 'Grupper',
    icon: 'people-circle-outline',
    url: '/admin/groups',
  },
  {
    admin: true,
    key: 'email',
    title: 'E-post',
    icon: 'mail-outline',
    url: '/admin/email',
  },
  {
    admin: true,
    key: 'surveys',
    title: 'Spørreundersøkelser',
    icon: 'create-outline',
    url: '/surveys',
  },
];

const EXTERNAL_LINKS: Link[] = [
  {
    key: 'warning-portal',
    requireLogin: true,
    title: 'Varslingsportal',
    icon: 'warning-outline',
    url: 'https://portal.mittvarsel.no/skjema/abakus/t3fMsqnZcCaeFX2u.9824?lang=no',
  },
  {
    key: 'bill',
    requireLogin: true,
    title: 'Kvitteringsskildring',
    icon: 'receipt-outline',
    url: 'https://kvittering.abakus.no',
  },
  {
    key: 'wiki',
    requireLogin: true,
    title: 'Wiki',
    icon: 'document-text-outline',
    url: 'https://wiki.abakus.no',
  },
  {
    key: 'ababart',
    requireLogin: true,
    title: 'Se flere',
    icon: 'link-outline',
    url: 'https://aba.wtf',
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
    .map(({ url, title, icon }) => [
      url,
      icon ? (
        <TextWithIcon
          content={title}
          iconName={icon}
          className={styles.quickLinkContent}
        />
      ) : (
        title
      ),
    ]) as NavigationLink[];
}

export type NavigationLink = [string, ReactNode]; // [url, label(as a react-node)]

export function getRegularLinks(options: Options): Array<NavigationLink> {
  return retrieveAllowed(SORTED_REGULAR, options);
}
export function getExternalLinks(options: Options): Array<NavigationLink> {
  return retrieveAllowed(EXTERNAL_LINKS, options);
}
export function getAdminLinks(options: Options): Array<NavigationLink> {
  return retrieveAllowed(SORTED_ADMIN, options);
}
export const stripHtmlTags = (s: string): string => {
  return s.replace(/<(.|\n)*?>/g, '');
};
