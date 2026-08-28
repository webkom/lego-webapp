import { Flex, Icon } from '@webkom/lego-bricks';
import {
  Home,
  CircleUser,
  CalendarRange,
  Users,
  ShoppingCart,
  Terminal,
  Newspaper,
  Briefcase,
  BookOpen,
  BookImage,
  Quote,
  Trophy,
  Settings,
  MessageSquareQuote,
  Landmark,
  LogOut,
  MoonStar,
  Sun,
} from 'lucide-react';
import { navigate } from 'vike/client/router';
import Tag from '~/components/Tags/Tag';
import { logout } from '~/redux/actions/UserActions';
import getInterestIcon from '~/utils/getInterestIcon';
import { applySelectedTheme } from '~/utils/themeUtils';
import type { ResolvedTheme } from '~/utils/themeUtils';

type Command = {
  id: string;
  renderLabel: string | React.ReactNode;
  searchText: string;
  action: () => void;
  icon?: React.ReactNode;
};

type CommandSection = {
  name: string;
  items: Command[];
};

const createCommands = (
  dispatch: any,
  suggestionIds: string[] = [],
  theme: ResolvedTheme,
): CommandSection[] => {
  const InterestIcon = getInterestIcon();
  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  const themeLabel =
    nextTheme === 'dark' ? 'Mørkt tema' : 'Lyst tema';
  const sections: CommandSection[] = [
    {
      name: 'Navigasjon',
      items: [
        {
          id: 'home',
          renderLabel: 'Hjem',
          searchText: 'Hjem',
          action: () => navigate('/'),
          icon: <Icon iconNode={<Home />} size={15} />,
        },
        {
          id: 'profile',
          renderLabel: 'Profil',
          searchText: 'Profil',
          action: () => navigate('/users/me'),
          icon: <Icon iconNode={<CircleUser />} size={15} />,
        },
        {
          id: 'events',
          renderLabel: 'Arrangementer',
          searchText: 'Arrangementer',
          action: () => navigate('/events'),
          icon: <Icon iconNode={<CalendarRange />} size={15} />,
        },
        {
          id: 'meetings',
          renderLabel: 'Møter',
          searchText: 'Møter',
          action: () => navigate('/meetings'),
          icon: <Icon iconNode={<Users />} size={15} />,
        },
        {
          id: 'lending',
          renderLabel: 'Utlån',
          searchText: 'Utlån',
          action: () => navigate('/lending'),
          icon: <Icon iconNode={<ShoppingCart />} size={15} />,
        },
        {
          id: 'interestGroups',
          renderLabel: (
            <Flex alignItems="center" gap={10}>
              Interessegrupper <Tag tag="Nytt!!" color="orange" />
            </Flex>
          ),
          searchText: 'Interessegrupper',
          action: () => navigate('/events/interest'),
          icon: <Icon iconNode={<InterestIcon />} size={15} />,
        },
        {
          id: 'joblistings',
          renderLabel: 'Jobbannonser',
          searchText: 'Jobbannonser',
          action: () => navigate('/joblistings'),
          icon: <Icon iconNode={<Newspaper />} size={15} />,
        },
        {
          id: 'companies',
          renderLabel: 'Bedrifter',
          searchText: 'Bedrifter',
          action: () => navigate('/companies'),
          icon: <Icon iconNode={<Briefcase />} size={15} />,
        },
        {
          id: 'articles',
          renderLabel: 'Artikler',
          searchText: 'Artikler',
          action: () => navigate('/articles'),
          icon: <Icon iconNode={<BookOpen />} size={15} />,
        },
        {
          id: 'gallery',
          renderLabel: 'Album',
          searchText: 'Album',
          action: () => navigate('/photos'),
          icon: <Icon iconNode={<BookImage />} size={15} />,
        },
        {
          id: 'quotes',
          renderLabel: 'Overhørt',
          searchText: 'Overhørt',
          action: () => navigate('/quotes'),
          icon: <Icon iconNode={<Quote />} size={15} />,
        },
        {
          id: 'trophies',
          renderLabel: 'Trofeer',
          searchText: 'Trofeer',
          action: () => navigate('/achievements'),
          icon: <Icon iconNode={<Trophy />} size={15} />,
        },
        {
          id: 'theFund',
          renderLabel: 'Fondet',
          searchText: 'Fondet',
          action: () => window.open('https://fondet.abakus.no/', '_blank'),
          icon: <Icon iconNode={<Landmark />} size={15} />,
        },
        {
          id: 'developerBlog',
          renderLabel: 'Utviklerbloggen',
          searchText: 'Utviklerbloggen',
          action: () => window.open('https://webkom.dev/', '_blank'),
          icon: <Icon iconNode={<MessageSquareQuote />} size={15} />,
        },
        {
          id: 'settings',
          renderLabel: 'Innstillinger',
          searchText: 'Innstillinger',
          action: () => navigate('/users/me/settings/profile'),
          icon: <Icon iconNode={<Settings />} size={15} />,
        },
      ],
    },
    {
      name: 'Kommandoer',
      items: [
        {
          id: 'createMeetingNotice',
          renderLabel: 'Lag møteinnkalling',
          searchText: 'Lag møteinnkalling',
          action: () => navigate('/meetings/new'),
          icon: <Icon iconNode={<Terminal />} size={15} />,
        },
        {
          id: 'createReceipt',
          renderLabel: 'Lag kvittering',
          searchText: 'Lag kvittering',
          action: () => window.open('https://kvittering.abakus.no/', '_blank'),
          icon: <Icon iconNode={<Terminal />} size={15} />,
        },
        {
          id: 'createQuote',
          renderLabel: 'Lag sitat',
          searchText: 'Lag sitat',
          action: () => navigate('/quotes/new'),
          icon: <Icon iconNode={<Terminal />} size={15} />,
        },
        {
          id: 'createAlbum',
          renderLabel: 'Lag album',
          searchText: 'Lag album',
          action: () => navigate('/photos/new'),
          icon: <Icon iconNode={<Terminal />} size={15} />,
        },
      ],
    },
    {
      name: 'Systemvalg',
      items: [
        {
          id: 'toggleTheme',
          renderLabel: themeLabel,
          searchText: themeLabel,
          icon: (
            <Icon
              iconNode={nextTheme === 'dark' ? <MoonStar /> : <Sun />}
              size={15}
            />
          ),
          action: () => dispatch(applySelectedTheme(nextTheme)),
        },
        {
          id: 'logout',
          renderLabel: 'Logg ut',
          searchText: 'Logg ut',
          icon: <Icon iconNode={<LogOut />} size={15} />,
          action: () => {
            dispatch(logout());
            navigate('/');
          },
        },
      ],
    },
  ];

  const allCommands = sections.flatMap((section) => section.items);

  const suggestedItems: Command[] = suggestionIds
    .map((id) => allCommands.find((c) => c.id === id))
    .filter(Boolean) as Command[];

  const filteredSections = sections.map((section) => ({
    ...section,
    items: section.items.filter((item) => !suggestionIds.includes(item.id)),
  }));

  return suggestedItems.length
    ? [{ name: 'Dine forslag', items: suggestedItems }, ...filteredSections]
    : sections;
};

export default createCommands;
