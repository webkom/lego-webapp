import { Flex } from '@webkom/lego-bricks';
import { sample } from 'lodash';
import {
  BadgeInfo,
  BarChart3,
  BookImage,
  BookOpenText,
  BriefcaseBusiness,
  CalendarRange,
  CircleUser,
  Database,
  ExternalLink,
  FilePieChart,
  Group,
  MailSearch,
  MailWarning,
  MessageCircleHeart,
  MessageCircleWarning,
  MessageCircleQuestion,
  MessagesSquare,
  Newspaper,
  Phone,
  ReceiptText,
  ScrollText,
  Send,
  Tags,
  Telescope,
  Users,
} from 'lucide-react';
import ReadmeLogo from 'app/components/ReadmeLogo';
import { Tag } from 'app/components/Tags';
import TextWithIcon from '../TextWithIcon';
import type { AllowedPages } from 'app/actions/MetaActions';
import type { ReactNode } from 'react';

type Link = {
  key: string;
  title: ReactNode;
  url: string;
  admin?: boolean;
  requireLogin?: boolean;
  icon?: ReactNode;
};

const LINKS: Array<Link> = [
  {
    key: 'profile',
    requireLogin: true,
    title: 'Profil',
    icon: <CircleUser />,
    url: '/users/me',
  },
  {
    key: 'contact',
    requireLogin: true,
    title: 'Kontakt Abakus',
    icon: <Phone />,
    url: '/contact',
  },
  {
    key: 'articles',
    title: 'Artikler',
    icon: <BookOpenText />,
    url: '/articles',
  },
  {
    key: 'forum',
    title: (
      <Flex alignItems="center" gap="var(--spacing-sm)">
        Forum
        <Tag tag="Beta" color="purple" />
      </Flex>
    ),
    icon: <MessagesSquare />,
    url: '/forum',
  },
  {
    key: 'events',
    title: 'Arrangementer',
    icon: <CalendarRange />,
    url: '/events',
  },
  {
    key: 'aboutUs',
    title: 'Om Abakus',
    icon: <BadgeInfo />,
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
    icon: <Telescope />,
    url: '/interest-groups',
  },
  {
    key: 'galleries',
    title: 'Album',
    icon: <BookImage />,
    url: '/photos',
  },
  {
    key: 'meetings',
    title: 'Møter',
    icon: <Users />,
    url: '/meetings',
  },
  {
    key: 'quotes',
    title: 'Overhørt',
    icon: sample([
      <MessageCircleWarning key="1" />,
      <MessageCircleHeart key="2" />,
      <MessageCircleQuestion key="3" />,
    ]),
    url: '/quotes/',
  },
  {
    key: 'companies',
    title: 'Bedrifter',
    icon: <BriefcaseBusiness />,
    url: '/companies',
  },
  {
    key: 'jobListings',
    title: 'Jobbannonser',
    icon: <Newspaper />,
    url: '/joblistings',
  },
  {
    key: 'tags',
    title: 'Tags',
    icon: <Tags />,
    url: '/tags',
  },
  {
    key: 'polls',
    title: 'Avstemninger',
    icon: <BarChart3 />,
    url: '/polls',
  },
  {
    admin: true,
    key: 'announcements',
    title: 'Kunngjøringer',
    icon: <Send />,
    url: '/announcements',
  },
  {
    admin: true,
    key: 'bdb',
    title: 'Bedriftsdatabase',
    icon: <Database />,
    url: '/bdb',
  },
  {
    admin: true,
    key: 'groups',
    title: 'Grupper',
    icon: <Group />,
    url: '/admin/groups',
  },
  {
    admin: true,
    key: 'email',
    title: 'E-post',
    icon: <MailSearch />,
    url: '/admin/email',
  },
  {
    admin: true,
    key: 'surveys',
    title: 'Spørreundersøkelser',
    icon: <FilePieChart />,
    url: '/surveys',
  },
];

const EXTERNAL_LINKS: Link[] = [
  {
    key: 'warning-portal',
    requireLogin: true,
    title: 'Varslingsportal',
    icon: <MailWarning />,
    url: 'https://portal.mittvarsel.no/skjema/abakus/t3fMsqnZcCaeFX2u.9824?lang=no',
  },
  {
    key: 'bill',
    requireLogin: true,
    title: 'Kvitteringsskildring',
    icon: <ReceiptText />,
    url: 'https://kvittering.abakus.no',
  },
  {
    key: 'wiki',
    requireLogin: true,
    title: 'Wiki',
    icon: <ScrollText />,
    url: 'https://wiki.abakus.no',
  },
  {
    key: 'ababart',
    requireLogin: true,
    title: 'Se flere',
    icon: <ExternalLink />,
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
  allowed: AllowedPages;
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
      icon ? <TextWithIcon content={title} iconNode={icon} /> : title,
    ]) satisfies NavigationLink[];
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
