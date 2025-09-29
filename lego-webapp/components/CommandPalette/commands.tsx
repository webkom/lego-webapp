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

const createCommands = (dispatch: any): CommandSection[] => [
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
        id: 'articler',
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
        id: 'Create meeting notice',
        label: 'Lag møteinnkalling',
        action: () => navigate('/meetings/new'),
        icon: <Icon iconNode={<Terminal />} size={15} />,
      },
      {
        id: 'Create quote',
        label: 'Lag sitat',
        action: () => navigate('/quotes/new'),
        icon: <Icon iconNode={<Terminal />} size={15} />,
      },
      {
        id: 'Create album',
        label: 'Lag album',
        action: () => navigate('/photos/new'),
        icon: <Icon iconNode={<Terminal />} size={15} />,
      },
    ],
  },
  {
    name: '',
    items: [
      {
        id: 'logout',
        label: 'Logg ut',
        action: () => {
          dispatch(logout());
          navigate('/');
        },
      },
    ],
  },
];

export default createCommands;
