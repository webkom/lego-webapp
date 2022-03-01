// @flow

import Flex from 'app/components/Layout/Flex';
import { Image } from 'app/components/Image';
import ReadmeLogo from 'app/components/ReadmeLogo';

import styles from './ReadmePlacard.css';
import Placard from './Placard';

type Props = {
  readmes: Array<Object>,
};

const ReadmePlacard = ({ readmes }: Props) => {
  return (
    <Flex
      column
      justifyContent="space-between"
      alignItems="center"
      className={styles.container}
    >
      <Placard justifyContent="space-between">
        <a href="https://readme.abakus.no" className={styles.logo}>
          <ReadmeLogo />
        </a>
        <Flex alignItems="flex-start" className={styles.readmes}>
          {readmes.slice(0, 3).map(({ image, pdf, title }) => (
            <div key={title} className={styles.readme}>
              <a href={pdf} className={styles.thumb}>
                <Image src={image} />
              </a>
            </div>
          ))}
        </Flex>
      </Placard>
    </Flex>
  );
};

export default ReadmePlacard;
