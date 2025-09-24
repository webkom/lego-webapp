import { navigate } from 'vike/client/router';

type Command = {
  id: string;
  label: string;
  action: () => void;
};

type CommandSection = {
  name: string;
  items: Command[];
};

const commands: CommandSection[] = [
  {
    name: 'Navigasjon',
    items: [
      { id: 'home', label: 'Hjem', action: () => navigate('/') },
      { id: 'profile', label: 'Profil', action: () => navigate('/users/me') },
      {
        id: 'events',
        label: 'Arrangementer',
        action: () => navigate('/events'),
      },
      { id: 'meetings', label: 'Møter', action: () => navigate('/meetings') },
      { id: 'lending', label: 'Utlån', action: () => navigate('/lending') },
      {
        id: 'interest groups',
        label: 'Interessegrupper',
        action: () => navigate('/interest-groups'),
      },
      {
        id: 'joblistings',
        label: 'Jobbannonser',
        action: () => navigate('/joblistings'),
      },
      {
        id: 'companies',
        label: 'Bedrifter',
        action: () => navigate('/companies'),
      },
      {
        id: 'articler',
        label: 'Artikler',
        action: () => navigate('/articles'),
      },
      { id: 'gallery', label: 'Album', action: () => navigate('/photos') },
      { id: 'quotes', label: 'Overhørt', action: () => navigate('/quotes') },
      { id: 'trophies', label: 'Trofeer', action: () => navigate('/trophies') },
      {
        id: 'settings',
        label: 'Innstillinger',
        action: () => navigate('/users/me/settings/profile'),
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
      },
      {
        id: 'Create album',
        label: 'Lag album',
        action: () => navigate('/photos/new'),
      },
    ],
  },
];

export default commands;
