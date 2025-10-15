import { Flex, Image } from '@webkom/lego-bricks';
import styles from './index.module.css';

const FindTheLogo = () => {
  const logo =
    'https://raw.githubusercontent.com/webkom/lego/master/assets/abakus_webkom.png';

  return (
    <Flex column gap={5}>
      <h2>Finn logoene og trykk på dem!</h2>
      <div className={styles.frame}>
        <div className={styles.source}>
          <Image
            src="../../assets/om-abakus-banner.png"
            alt="Bilde"
            className={styles.bgImage}
          />
          <button className={styles.logoButton} style={{top: 0, left: 0}}>
            <Image src={logo} alt="Logo" />
          </button>
        </div>
      </div>
    </Flex>
  );
};

export default FindTheLogo;
