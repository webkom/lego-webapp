import { Flex } from '@webkom/lego-bricks';
import { sample } from 'lodash-es';
import {
  Banana,
  BookImage,
  BookOpenText,
  BriefcaseBusiness,
  CalendarRange,
  ChartNoAxesColumn,
  Database,
  ExternalLink,
  FilePieChart,
  Gamepad,
  Group,
  Info,
  MailSearch,
  MailWarning,
  MessageCircleHeart,
  MessageCircleWarning,
  MessageCircleQuestion,
  MessageCircleX,
  MessagesSquare,
  MountainSnow,
  Newspaper,
  Phone,
  ReceiptText,
  ScrollText,
  Send,
  Users,
  ShoppingCart,
  Accessibility,
  Trophy,
  MessageSquareQuote,
} from 'lucide-react';
import ReadmeLogo from '~/components/ReadmeLogo';
import { Tag } from '~/components/Tags';
import TextWithIcon from '../TextWithIcon';
import type { ReactNode } from 'react';
import type { AllowedPages } from '~/redux/actions/MetaActions';

type Link = {
  key: string;
  title: ReactNode;
  sortTitle?: string;
  url: string;
  admin?: boolean;
  requireLogin?: boolean;
  icon?: ReactNode;
};

const LINKS: Array<Link> = [
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
    sortTitle: 'Forum',
    icon: <MessagesSquare />,
    url: '/forum',
  },
  {
    key: 'lending',
    requireLogin: true,
    title: (
      <Flex alignItems="center" gap="var(--spacing-sm)">
        Utlån
        <Tag tag="Beta" color="purple" />
      </Flex>
    ),
    sortTitle: 'Utlån',
    icon: <ShoppingCart />,
    url: '/lending',
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
    icon: <Info />,
    url: '/pages/info-om-abakus',
  },
  {
    key: 'readme',
    title: <ReadmeLogo />,
    sortTitle: 'Readme',
    url: 'https://readme.abakus.no',
  },
  {
    key: 'interest-groups',
    title: 'Interessegrupper',
    icon: sample([
      <Banana key="1" />,
      <Gamepad key="2" />,
      <MountainSnow key="3" />,
    ]),
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
      <MessageCircleX key="4" />,
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
    key: 'polls',
    title: 'Avstemninger',
    icon: <ChartNoAxesColumn />,
    url: '/polls',
  },
  {
    key: 'achievements',
    title: 'Trofeer',
    icon: <Trophy />,
    url: '/achievements',
    requireLogin: true,
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
    url: '/admin/email/lists',
  },
  {
    admin: true,
    key: 'surveys',
    title: 'Spørreundersøkelser',
    icon: <FilePieChart />,
    url: '/surveys',
  },
  {
    admin: true,
    key: 'sudo',
    title: 'Sudo',
    icon: <Accessibility />,
    url: '/sudo',
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
    key: 'blog',
    requireLogin: false,
    title: 'Utviklerbloggen',
    icon: <MessageSquareQuote />,
    url: 'https://webkom.dev',
  },
  {
    key: 'ababart',
    requireLogin: true,
    title: 'Se flere',
    icon: <ExternalLink />,
    url: 'https://aba.wtf',
  },
];

const getSortTitle = (link: Link) =>
  link.sortTitle || (typeof link.title === 'string' ? link.title : link.key);

const sortFn = (a: Link, b: Link) =>
  getSortTitle(a).localeCompare(getSortTitle(b));

const SORTED_REGULAR = LINKS.filter((link) => !link.admin).sort(sortFn);
const SORTED_ADMIN = LINKS.filter((link) => link.admin).sort(sortFn);
type Options = {
  allowed: AllowedPages;
  loggedIn: boolean;
};

const SORTED_ALL = [...SORTED_REGULAR, ...EXTERNAL_LINKS, ...SORTED_ADMIN];

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
export function getAllLinksFiltered(
  options: Options,
  query: string,
): Array<NavigationLink> {
  const filteredLinks = SORTED_ALL.filter((link) =>
    getSortTitle(link).toLowerCase().includes(query.toLowerCase()),
  );
  return retrieveAllowed(filteredLinks, options);
}
export const stripHtmlTags = (s: string): string => {
  return s.replace(/<(.|\n)*?>/g, '');
};
