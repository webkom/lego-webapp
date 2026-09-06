import { BaseCard, CardContent, Flex, Image } from '@webkom/lego-bricks';
import cx from 'classnames';
import { ChevronRight } from 'lucide-react';
import { readmeIfy } from '~/components/ReadmeLogo';
import { useAppSelector } from '~/redux/hooks';
import utilStyles from '~/styles/utilities.module.css';
import styles from './ReadmeShowcase.module.css';
import useReadmeRotation from './useReadmeRotation';
import useSectionReveal from './useSectionReveal';
import type { CSSProperties } from 'react';

type Props = {
  style?: CSSProperties;
};

export const SHOWCASED_EDITIONS = 3;

const CROP_CORNERS = [
  'TopLeft',
  'TopRight',
  'BottomLeft',
  'BottomRight',
] as const;

const issueLabel = (utgave: number, year: number) =>
  `Utgave ${utgave} - ${year}`;

const ReadmeShowcase = ({ style }: Props) => {
  const readmes = useAppSelector((state) => state.readme);
  const editions = readmes.slice(0, SHOWCASED_EDITIONS);
  const {
    activeIndex,
    setActiveIndex,
    cardRef,
    fillRefs,
    coverLayerRefs,
    pauseRotation,
    resumeRotation,
  } = useReadmeRotation(editions.length);
  const sectionRef = useSectionReveal();

  return (
    <Flex column component="section" style={style} componentRef={sectionRef}>
      <h3 className={utilStyles.frontPageHeader} data-reveal>
        Vårt studentmagasin
      </h3>
      <BaseCard
        shadow
        column={false}
        className={styles.card}
        componentRef={cardRef}
        data-reveal
      >
        <div className={styles.raster} aria-hidden="true" />
        {CROP_CORNERS.map((corner) => (
          <span
            key={corner}
            className={cx(styles.cropMark, styles[`crop${corner}`])}
            aria-hidden="true"
          />
        ))}
        {editions.length > 0 && (
          <a
            className={styles.featuredCover}
            href={editions[activeIndex].pdf}
            rel="noreferrer"
            target="_blank"
            onMouseEnter={pauseRotation}
            onMouseLeave={resumeRotation}
          >
            {editions.map(({ image, title }, index) => (
              <div
                key={title}
                className={styles.coverLayer}
                ref={(el) => {
                  coverLayerRefs.current[index] = el;
                }}
              >
                <Image src={image} alt={`Forsidebildet til ${title}`} />
              </div>
            ))}
          </a>
        )}
        <CardContent className={styles.info}>
          <span className={styles.wordmark}>
            {readmeIfy('readme')}
            <span className={styles.wordmarkDot}>.</span>
          </span>
          <div className={styles.archive}>
            {editions.map(({ title, utgave, year }, index) => (
              <button
                key={title}
                type="button"
                className={styles.archiveRow}
                onClick={() => setActiveIndex(index)}
              >
                <span
                  className={styles.fill}
                  aria-hidden="true"
                  ref={(el) => {
                    fillRefs.current[index] = el;
                  }}
                />
                <span>{issueLabel(utgave, year)}</span>
                <ChevronRight className={styles.arrow} size={14} />
              </button>
            ))}
            <a
              className={cx(styles.archiveRow, styles.archiveAllRow)}
              href="https://readme.abakus.no/"
              rel="noreferrer"
              target="_blank"
            >
              <span>Se hele arkivet</span>
              <ChevronRight className={styles.arrow} size={14} />
            </a>
          </div>
        </CardContent>
      </BaseCard>
    </Flex>
  );
};

export default ReadmeShowcase;
