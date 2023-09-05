import { Card, Flex, Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import { useEffect, useState } from 'react';
import { Collapse } from 'react-collapse';
import { Image } from 'app/components/Image';
import { readmeIfy } from 'app/components/ReadmeLogo';
import type { Readme } from 'app/models';
import styles from './LatestReadme.css';
import type { CSSProperties } from 'react';

type Props = {
  expandedInitially?: boolean;
  collapsible?: boolean;
  readmes: Array<Readme>;
  style?: CSSProperties;
};

const LatestReadme = ({
  readmes,
  expandedInitially = true,
  collapsible = true,
  style,
}: Props) => {
  const [expanded, setExpanded] = useState(expandedInitially);

  useEffect(() => {
    setExpanded(expandedInitially);
  }, [expandedInitially]);

  return (
    <Card className={styles.latestReadme} style={style}>
      {collapsible ? (
        <div
          className={cx(styles.heading, styles.pointer)}
          onClick={() => setExpanded(!expanded)}
        >
          <Flex justifyContent="space-between" alignItems="center">
            {readmeIfy('readme')}
            <Icon
              name="chevron-forward-outline"
              onClick={() => setExpanded(!expanded)}
              className={cx(styles.expand, expanded && styles.rotate)}
            />
          </Flex>
        </div>
      ) : (
        <div className={styles.heading}>{readmeIfy('readme')}</div>
      )}

      <Collapse isOpened={expanded}>
        <Flex
          wrap
          justifyContent="space-around"
          style={{
            paddingTop: 15,
          }}
        >
          {readmes.slice(0, 4).map(({ image, pdf, title }) => (
            <a key={title} href={pdf} className={styles.thumb}>
              <Image src={image} alt={`Cover of ${title}`} />
            </a>
          ))}
        </Flex>
      </Collapse>
    </Card>
  );
};

export default LatestReadme;
