import { BaseCard, Flex, Image, LinkButton } from '@webkom/lego-bricks';
import cx from 'classnames';
import { ChevronRight } from 'lucide-react';
import moment from 'moment-timezone';
import buddyWeekGraphic from '~/assets/frontpage-graphic-buddyweek.png';
import dataGraphic from '~/assets/frontpage-graphic-data.png';
import forCompaniesGraphic from '~/assets/frontpage-graphic-for-companies.png';
import komtekGraphic from '~/assets/frontpage-graphic-komtek.png';
import utilStyles from '~/styles/utilities.module.css';
import styles from './UsefulLinks.module.css';
import useSectionReveal from './useSectionReveal';
import type { CSSProperties } from 'react';

type Props = {
  style?: CSSProperties;
};

const BUDDY_WEEK_URL = 'https://ny.abakus.no/#fadderperioden';
const FOR_COMPANIES_URL = '/pages/bedrifter/for-bedrifter';

/** `cell` is the bento cell each card is placed in, see the grid in the stylesheet */
const STUDIES = [
  {
    cell: styles.studyData,
    graphic: dataGraphic,
    title: 'Datateknologi',
    text: 'En sentral del av alle fremtidsrettede teknologier - alt fra KI til medisinsk teknologi.',
    url: 'https://www.ntnu.no/studier/mtdt',
  },
  {
    cell: styles.studyKomtek,
    graphic: komtekGraphic,
    title: 'Cybersikkerhet og datakommunikasjon',
    text: 'Vi lever stadig mer av livene våre på nett. Sikkerhet blir bare viktigere.',
    url: 'https://www.ntnu.no/studier/mtkom',
  },
];

type CardBodyProps = {
  title: string;
  text: string;
  linkText: string;
  url: string;
  external?: boolean;
};

const CardBody = ({ title, text, linkText, url, external }: CardBodyProps) => (
  <Flex column gap="var(--spacing-sm)" className={styles.body}>
    <span className={styles.title}>{title}</span>
    <Flex column gap="var(--spacing-sm)" className={styles.textGroup}>
      <span className={styles.text}>{text}</span>
      <Flex
        component="a"
        alignItems="center"
        gap="var(--spacing-xs)"
        className={styles.textLink}
        href={url}
        rel={external ? 'noreferrer' : undefined}
        target={external ? '_blank' : undefined}
      >
        {linkText}
        <ChevronRight className={styles.arrow} size={14} />
      </Flex>
    </Flex>
  </Flex>
);

const UsefulLinks = ({ style }: Props) => {
  const sectionRef = useSectionReveal();

  return (
    <Flex column component="section" style={style} componentRef={sectionRef}>
      <h3 className={utilStyles.frontPageHeader} data-reveal>
        Nyttige lenker
      </h3>
      <div className={styles.bento}>
        <BaseCard
          shadow
          column={false}
          className={cx(styles.card, styles.featured)}
          data-reveal
        >
          <Flex
            alignItems="center"
            justifyContent="center"
            className={styles.featuredImage}
          >
            <Image src={buddyWeekGraphic} alt="Fadderperioden" />
          </Flex>
          <Flex column gap="var(--spacing-sm)" className={styles.featuredBody}>
            <span className={styles.featuredTitle}>
              Fadderperioden {moment().year()}
            </span>
            <span className={styles.featuredText}>
              Abakus arrangerer fadderperioden for alle nye studenter. Alt du
              trenger å vite til studiestart, samlet på ett sted.
            </span>
            <LinkButton
              dark
              className={styles.featuredAction}
              href={BUDDY_WEEK_URL}
              rel="noreferrer"
              target="_blank"
            >
              Les deg opp
            </LinkButton>
          </Flex>
        </BaseCard>

        <BaseCard shadow className={cx(styles.card, styles.tall)} data-reveal>
          <Flex
            alignItems="center"
            justifyContent="center"
            className={styles.tallImage}
          >
            <Image src={forCompaniesGraphic} alt="For bedrifter" />
          </Flex>
          <CardBody
            title="For bedrifter"
            text="Informasjon om bedriftspresentasjoner, prosedyrer og samarbeid med Abakus."
            linkText="Undersøk muligheter"
            url={FOR_COMPANIES_URL}
          />
        </BaseCard>

        {STUDIES.map(({ cell, graphic, title, text, url }) => (
          <BaseCard
            key={title}
            shadow
            column={false}
            className={cx(styles.card, styles.study, cell)}
            data-reveal
          >
            <Flex
              alignItems="center"
              justifyContent="center"
              className={styles.studyImage}
            >
              <Image src={graphic} alt={title} />
            </Flex>
            <CardBody
              title={title}
              text={text}
              linkText="Sjekk ut studiet"
              url={url}
              external
            />
          </BaseCard>
        ))}
      </div>
    </Flex>
  );
};

export default UsefulLinks;
