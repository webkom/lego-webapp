import { Accordion, Card, Flex, Icon, Image } from '@webkom/lego-bricks';
import cx from 'classnames';
import { ChevronRight } from 'lucide-react';
import { readmeIfy } from 'app/components/ReadmeLogo';
import { useAppSelector } from 'app/store/hooks';
import styles from './LatestReadme.module.css';
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

  return (
    <Card className={styles.latestReadme} style={style}>
      <Accordion
        defaultOpen={expandedInitially}
        disabled={!collapsible}
        triggerComponent={({ onClick, disabled, rotateClassName }) => (
          <div
            className={cx(styles.heading, !disabled && styles.pointer)}
            onClick={!disabled ? onClick : undefined}
          >
            <Flex justifyContent="space-between" alignItems="center">
              {readmeIfy('readme')}
              {!disabled && (
                <Icon
                  onPress={onClick}
                  iconNode={<ChevronRight />}
                  className={rotateClassName}
                />
              )}
            </Flex>
          </div>
        )}
      >
        <div className={styles.thumbnailContainer}>
          {readmes.slice(0, displayCount).map(({ image, pdf, title }) => (
            <a key={title} href={pdf} className={styles.thumb}>
              <Image src={image} alt={`Forsidebildet til ${title}`} />
            </a>
          ))}
        </div>
      </Accordion>
    </Card>
  );
};

export default LatestReadme;
