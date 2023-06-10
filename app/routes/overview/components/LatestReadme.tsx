import cx from 'classnames';
import { useEffect, useState } from 'react';
import { Collapse } from 'react-collapse';
import Card from 'app/components/Card';
import Icon from 'app/components/Icon';
import { Image } from 'app/components/Image';
import { Flex } from 'app/components/Layout';
import { readmeIfy } from 'app/components/ReadmeLogo';
import type { Readme } from 'app/models';
import styles from './LatestReadme.module.css';
import type { CSSProperties } from 'react';

type Props = {
  expandedInitially: boolean;
  collapsible?: boolean;
  readmes: Array<Readme>;
  style?: CSSProperties;
  imageClassName?: string;
};

const LatestReadme = ({
  readmes,
  expandedInitially,
  collapsible = true,
  style,
  imageClassName,
}: Props) => {
  const [expanded, setExpanded] = useState(expandedInitially);

  useEffect(() => {
    setExpanded(expandedInitially);
  }, [expandedInitially]);

  return (
    <Card className={styles.latestReadme} style={style}>
      {collapsible ? (
        <button
          className={styles.heading}
          onClick={() => setExpanded(!expanded)}
        >
          <Flex justifyContent="space-between" alignItems="center">
            {readmeIfy('readme')}
            <Icon name={expanded ? 'close' : 'arrow-down'} />
          </Flex>
        </button>
      ) : (
        <div className={styles.heading}>{readmeIfy('readme')}</div>
      )}

      <Collapse isOpened={expanded}>
        <Flex
          wrap
          justifyContent="space-around"
          style={{
            paddingTop: 20,
          }}
        >
          {readmes.slice(0, 4).map(({ image, pdf, title }) => (
            <a
              key={title}
              href={pdf}
              className={cx(styles.thumb, imageClassName)}
            >
              <Image src={image} alt={`Cover of ${title}`} />
            </a>
          ))}
        </Flex>
      </Collapse>
    </Card>
  );
};

export default LatestReadme;
