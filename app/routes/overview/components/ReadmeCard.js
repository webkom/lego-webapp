import Flex from '../../../components/Layout/Flex';
import CardButton from './CardButton';
import { Image } from 'app/components/Image';
import { readmeIfy } from 'app/components/ReadmeLogo';

import styles from './ReadmeCard.css';
import BlankCard from './BlankCard';

type Props = {
  readmes: Array<Object>,
};

const ReadmeCard = ({ readmes }: Props) => {
  return (
    <Flex
      column
      justifyContent="space-between"
      alignItems="center"
      className={styles.container}
    >
      <BlankCard justifyContent="flex-start">
        <a href="https://readme.abakus.no" className={styles.logo}>
          {readmeIfy('readme')}
        </a>
        <Flex alignItems="center" className={styles.readmes}>
          {readmes.slice(0, 3).map(({ image, pdf, title }) => (
            <Flex
              key={title}
              column
              alignItems="center"
              justifyContent="space-between"
              className={styles.readme}
            >
              <a href={pdf} className={styles.thumb}>
                <Image src={image} />
              </a>
              <CardButton>LES</CardButton>
            </Flex>
          ))}
        </Flex>
      </BlankCard>
      {/* <CardButton href="https://readme.abakus.no" belowCard>
        FLERE readme's
      </CardButton> */}
    </Flex>
  );
};

export default ReadmeCard;
