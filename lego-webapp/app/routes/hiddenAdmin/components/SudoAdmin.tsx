import { Page, Flex } from '@webkom/lego-bricks';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import HTTPError from 'app/routes/errors';
import a4bc35b6c0664b45 from '~/assets/26e7499bfb6390d9/a4bc35b6c0664b45.jpg';
import acb2777779bbf024 from '~/assets/26e7499bfb6390d9/acb2777779bbf024.jpg';
import dfaa1f22f615ddf8 from '~/assets/26e7499bfb6390d9/dfaa1f22f615ddf8.jpg';
import f37dbd9155efe22a from '~/assets/26e7499bfb6390d9/f37dbd9155efe22a.jpg';
import php from '~/assets/26e7499bfb6390d9/php.gif';
import typing from '~/assets/26e7499bfb6390d9/typing.gif';
import { ContentMain, ContentSection } from '~/components/Content';
import { useAppSelector } from '~/redux/hooks';
import { guardLogin } from '~/utils/replaceUnlessLoggedIn';
import styles from './SudoAdmin.module.css';

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
          </Flex>
          <h2>Handlinger:</h2>
          <ul className={styles.list}>
            <li>
              <Link to={'/admin/banners'}>Banners</Link>
            </li>
            <li>
              <Link to={'#'}>FeatureToggle (Coming soon!)</Link>
            </li>
          </ul>
        </ContentMain>
      </ContentSection>
    </Page>
  );
};

export default guardLogin(SudoAdmin);
