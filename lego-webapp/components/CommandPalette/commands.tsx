import { Flex, Icon } from '@webkom/lego-bricks';
import {
  Home,
  CircleUser,
  Banana,
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
  Lock,
} from 'lucide-react';
import { navigate } from 'vike/client/router';
import closePaletteImage from '~/assets/interest-group-logos/785f3ec7eb32f30b90cd0fcf3657d388b5ff4297f2f9716ff66e9b69c05ddd09.png';
import Tag from '~/components/Tags/Tag';
import { logout } from '~/redux/actions/UserActions';
import type { ReactNode } from 'react';

type Command = {
  id: string;
  renderLabel: string | ReactNode;
  searchText: string;
  action: () => void;
  icon?: ReactNode;
};

type CommandSection = {
  name: string;
  items: Command[];
};

const createCommands = (
  dispatch: any,
  suggestionIds: string[] = [],
): CommandSection[] => {
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
          renderLabel: (
            <Flex alignItems="center" gap={10}>
              Utlån <Tag tag="Nytt!!" color="pink" />
            </Flex>
          ),
          searchText: 'Utlån',
          action: () => navigate('/lending'),
          icon: <Icon iconNode={<ShoppingCart />} size={15} />,
        },
        {
          id: 'interestGroups',
          renderLabel: 'Interessegrupper',
          searchText: 'Interessegrupper',
          action: () => navigate('/interest-groups'),
          icon: <Icon iconNode={<Banana />} size={15} />,
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
          id: 'logout',
          renderLabel: 'Logg ut',
          searchText: 'Logg ut',
          icon: <Icon iconNode={<LogOut />} size={15} />,
          action: () => {
            dispatch(logout());
            navigate('/');
          },
        },
        {
          id: 'a',
          renderLabel: 'Lukk kommandopaletten',
          searchText: 'Lukk kommandopaletten',
          icon: (
            <img
              src={closePaletteImage}
              alt=""
              width={15}
              height={15}
              style={{ display: 'block' }}
            />
          ),
          action: () => {
            // This is a no-op, the actual closing is handled in the CommandPalette component
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
