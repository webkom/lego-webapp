import ItemGrid from './ItemGrid';
import type { ItemProps } from './Item';

const AboutDropdown = () => {
  const items: ItemProps[] = [
    {
      title: 'Generelt',
      description: 'Alt du trenger å vite om landets beste linjeforening',
      to: '/pages/info-om-abakus',
    },
    {
      title: 'For bedrifter',
      description: 'Les om alt Abakus kan tilby din bedrift',
      to: '/pages/bedrifter/for-bedrifter',
    },
    {
      title: 'Interessegrupper',
      description: 'Utforsk og engasjer deg i en interessegruppe',
      to: '/interestgroups',
    },
    {
      title: 'Revyen',
      description: 'Les om revyen og revygruppene i Abakus',
      to: '/pages/grupper/104-revyen',
    },
    {
      title: 'Komiteer',
      description: 'Les om ansvarsområdene til komiteene i Abakus',
      to: '/pages/komiteer/4',
    },
    {
      title: 'Kontakt Abakus',
      description: 'Nå ut til Hovedstyret, revyen eller komiteene',
      to: '/contact',
    },
  ];

  return <ItemGrid items={items} />;
};

export default AboutDropdown;
