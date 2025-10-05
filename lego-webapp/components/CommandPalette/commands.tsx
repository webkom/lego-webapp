import { Icon } from '@webkom/lego-bricks';
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
} from 'lucide-react';
import { navigate } from 'vike/client/router';
import { logout } from '~/redux/actions/UserActions';

type Command = {
  id: string;
  label: string;
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
): CommandSection[] => {
  const allSections: CommandSection[] = [
    {
      name: 'Navigasjon',
      items: [
        {
          id: 'home',
          label: 'Hjem',
          action: () => navigate('/'),
          icon: <Icon iconNode={<Home />} size={15} />,
        },
        {
          id: 'profile',
          label: 'Profil',
          action: () => navigate('/users/me'),
          icon: <Icon iconNode={<CircleUser />} size={15} />,
        },
        {
          id: 'events',
          label: 'Arrangementer',
          action: () => navigate('/events'),
          icon: <Icon iconNode={<CalendarRange />} size={15} />,
        },
        {
          id: 'meetings',
          label: 'Møter',
          action: () => navigate('/meetings'),
          icon: <Icon iconNode={<Users />} size={15} />,
        },
        {
          id: 'lending',
          label: 'Utlån',
          action: () => navigate('/lending'),
          icon: <Icon iconNode={<ShoppingCart />} size={15} />,
        },
        {
          id: 'interest groups',
          label: 'Interessegrupper',
          action: () => navigate('/interest-groups'),
          icon: <Icon iconNode={<Banana />} size={15} />,
        },
        {
          id: 'joblistings',
          label: 'Jobbannonser',
          action: () => navigate('/joblistings'),
          icon: <Icon iconNode={<Newspaper />} size={15} />,
        },
        {
          id: 'companies',
          label: 'Bedrifter',
          action: () => navigate('/companies'),
          icon: <Icon iconNode={<Briefcase />} size={15} />,
        },
        {
          id: 'articles',
          label: 'Artikler',
          action: () => navigate('/articles'),
          icon: <Icon iconNode={<BookOpen />} size={15} />,
        },
        {
          id: 'gallery',
          label: 'Album',
          action: () => navigate('/photos'),
          icon: <Icon iconNode={<BookImage />} size={15} />,
        },
        {
          id: 'quotes',
          label: 'Overhørt',
          action: () => navigate('/quotes'),
          icon: <Icon iconNode={<Quote />} size={15} />,
        },
        {
          id: 'trophies',
          label: 'Trofeer',
          action: () => navigate('/trophies'),
          icon: <Icon iconNode={<Trophy />} size={15} />,
        },
        {
          id: 'the fund',
          label: 'Fondet',
          action: () => navigate('https://fondet.abakus.no/'),
          icon: <Icon iconNode={<Landmark />} size={15} />,
        },
        {
          id: 'developerblog',
          label: 'Utviklerbloggen',
          action: () => navigate('https://webkom.dev/'),
          icon: <Icon iconNode={<MessageSquareQuote />} size={15} />,
        },
        {
          id: 'settings',
          label: 'Innstillinger',
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
          label: 'Lag møteinnkalling',
          action: () => navigate('/meetings/new'),
          icon: <Icon iconNode={<Terminal />} size={15} />,
        },
        {
          id: 'createReceipt',
          label: 'Lag kvittering',
          action: () => navigate('https://kvittering.abakus.no/'),
          icon: <Icon iconNode={<Terminal />} size={15} />,
        },
        {
          id: 'createQuote',
          label: 'Lag sitat',
          action: () => navigate('/quotes/new'),
          icon: <Icon iconNode={<Terminal />} size={15} />,
        },
        {
          id: 'createAlbum',
          label: 'Lag album',
          action: () => navigate('/photos/new'),
          icon: <Icon iconNode={<Terminal />} size={15} />,
        },
        {
          id: 'createLendingobject',
          label: 'Lag utlånsobjekt',
          action: () => navigate('/lending/new'),
          icon: <Icon iconNode={<Terminal />} size={15} />,
        },
      ],
    },
    {
      name: 'Systemvalg',
      items: [
        {
          id: 'logout',
          label: 'Logg ut',
          icon: <Icon iconNode={<LogOut />} size={15} />,
          action: () => {
            dispatch(logout());
            navigate('/');
          },
        },
      ],
    },
  ];

  const flatCommands = allSections.flatMap((s) => s.items);

  const suggestedItems: Command[] = suggestionIds
    .map((id) => flatCommands.find((c) => c.id === id))
    .filter(Boolean) as Command[];

  const dedupedSections = allSections.map((section) => ({
    ...section,
    items: section.items.filter((item) => !suggestionIds.includes(item.id)),
  }));

  return suggestedItems.length > 0
    ? [{ name: 'Dine forslag', items: suggestedItems }, ...dedupedSections]
    : allSections;
};

export default createCommands;
