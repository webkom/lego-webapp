import { Page, Flex, Card, Icon } from '@webkom/lego-bricks';
import { Flag, Rss } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import a4bc35b6c0664b45 from '~/assets/26e7499bfb6390d9/a4bc35b6c0664b45.jpg';
import acb2777779bbf024 from '~/assets/26e7499bfb6390d9/acb2777779bbf024.jpg';
import dfaa1f22f615ddf8 from '~/assets/26e7499bfb6390d9/dfaa1f22f615ddf8.jpg';
import f37dbd9155efe22a from '~/assets/26e7499bfb6390d9/f37dbd9155efe22a.jpg';
import php from '~/assets/26e7499bfb6390d9/php.gif';
import typing from '~/assets/26e7499bfb6390d9/typing.gif';
import { ContentMain, ContentSection } from '~/components/Content';
import HTTPError from '~/components/errors/HTTPError';
import { useAppSelector } from '~/redux/hooks';
import { guardLogin } from '~/utils/replaceUnlessLoggedIn';
import styles from './SudoAdmin.module.css';

type PanelItem = {
  link: string;
  tag: string;
  description: string;
  iconNode: JSX.Element;
};

const links: PanelItem[] = [
  {
    link: '/admin/banners',
    tag: 'Bannere',
    description: 'Legg til og endre bannere som vises på forsiden',
    iconNode: <Rss />,
  },
  {
    link: '/admin/featureflags',
    tag: 'Feature Flagg',
    description:
      'Legg til og endre feature flagg. Endre hva slags innhold som vises.',
    iconNode: <Flag />,
  },
];

const ControlPanelItem = ({ link }: { link: PanelItem }) => (
  <a href={link.link} className={styles.controlPanelItem}>
    <Card isHoverable>
      <Icon iconNode={link.iconNode} size={20} />
      <h3>{link.tag}</h3>
      <p>{link.description}</p>
    </Card>
  </a>
);

const AdminControlPanel = () => {
  return (
    <div className={styles.controlPanel}>
      <h2>Kontrollpanel</h2>
      <Flex gap="var(--spacing-md)">
        {links.map((link) => (
          <ControlPanelItem key={link.tag} link={link} />
        ))}
      </Flex>
    </div>
  );
};

const SudoAdmin = () => {
  const sudoAdminAccess = useAppSelector((state) => state.allowed.sudo);
  if (!sudoAdminAccess) return <HTTPError statusCode={1337} />;

  const images = [
    php,
    typing,
    a4bc35b6c0664b45,
    acb2777779bbf024,
    dfaa1f22f615ddf8,
    f37dbd9155efe22a,
  ];

  return (
    <Page title={'Sudo Admin'}>
      <Helmet title={'Sudo Admin'} />
      <ContentSection>
        <ContentMain>
          <Flex alignItems="center" column>
            <img
              src={images[Math.floor(Math.random() * images.length)]}
              alt="An image was supposed to be here but is not"
              width={400}
            />
            <AdminControlPanel />
          </Flex>
        </ContentMain>
      </ContentSection>
    </Page>
  );
};

export default guardLogin(SudoAdmin);
