import { Card, Flex, Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Image } from 'app/components/Image';
import { readmeIfy } from 'app/components/ReadmeLogo';
import { useAppSelector } from 'app/store/hooks';
import styles from './LatestReadme.css';
import type { CSSProperties } from 'react';

type Props = {
  expandedInitially?: boolean;
  collapsible?: boolean;
  style?: CSSProperties;
  displayCount?: number;
};

const LatestReadme = ({
  expandedInitially = true,
  collapsible = true,
  style,
  displayCount = 4,
}: Props) => {
  const readmes = useAppSelector((state) => state.readme);

  const ref = useRef<HTMLDivElement>(null);

  const [expanded, setExpanded] = useState(expandedInitially);
  const [containerHeight, setContainerHeight] = useState(0);
  const updateHeight = () => setContainerHeight(ref.current?.clientHeight ?? 0);

  useEffect(() => {
    setExpanded(expandedInitially);
  }, [expandedInitially]);

  return (
    <Card className={styles.latestReadme} style={style}>
      {collapsible ? (
        <div
          className={cx(styles.heading, styles.pointer)}
          onClick={() => {
            setExpanded(!expanded);
            updateHeight();
          }}
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

      <div
        className={styles.thumbnailWrapper}
        style={{
          height: expanded ? containerHeight : 0,
        }}
      >
        <div className={styles.thumbnailContainer} ref={ref}>
          {readmes.slice(0, displayCount).map(({ image, pdf, title }) => (
            <a key={title} href={pdf} className={styles.thumb}>
              <Image
                src={image}
                alt={`Cover of ${title}`}
                onLoad={() => updateHeight()}
              />
            </a>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default LatestReadme;
