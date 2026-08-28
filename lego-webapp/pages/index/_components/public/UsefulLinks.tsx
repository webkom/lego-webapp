import { BaseCard, Image, LinkButton } from '@webkom/lego-bricks';
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

const UsefulLinks = ({ style }: Props) => {
  const sectionRef = useSectionReveal();

  return (
    <section style={style} ref={sectionRef}>
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
          <div className={styles.featuredImage}>
            <Image src={buddyWeekGraphic} alt="Fadderperioden" />
          </div>
          <div className={styles.featuredBody}>
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
              href="https://ny.abakus.no/#fadderperioden"
              rel="noreferrer"
              target="_blank"
            >
              Les deg opp
            </LinkButton>
          </div>
        </BaseCard>

        <BaseCard shadow className={cx(styles.card, styles.tall)} data-reveal>
          <div className={styles.tallImage}>
            <Image src={forCompaniesGraphic} alt="For bedrifter" />
          </div>
          <div className={styles.body}>
            <span className={styles.title}>For bedrifter</span>
            <div className={styles.textGroup}>
              <span className={styles.text}>
                Informasjon om bedriftspresentasjoner, prosedyrer og samarbeid
                med Abakus.
              </span>
              <a
                className={styles.textLink}
                href="/pages/bedrifter/for-bedrifter"
              >
                Undersøk muligheter{' '}
                <ChevronRight className={styles.arrow} size={14} />
              </a>
            </div>
          </div>
        </BaseCard>

        <BaseCard
          shadow
          column={false}
          className={cx(styles.card, styles.study)}
          data-reveal
        >
          <div className={styles.studyImage}>
            <Image src={dataGraphic} alt="Datateknologi" />
          </div>
          <div className={styles.body}>
            <span className={styles.title}>Datateknologi</span>
            <div className={styles.textGroup}>
              <span className={styles.text}>
                En sentral del av alle fremtidsrettede teknologier - alt fra KI
                til medisinsk teknologi.
              </span>
              <a
                className={styles.textLink}
                href="https://www.ntnu.no/studier/mtdt"
                rel="noreferrer"
                target="_blank"
              >
                Sjekk ut studiet{' '}
                <ChevronRight className={styles.arrow} size={14} />
              </a>
            </div>
          </div>
        </BaseCard>

        <BaseCard
          shadow
          column={false}
          className={cx(styles.card, styles.study)}
          data-reveal
        >
          <div className={styles.studyImage}>
            <Image
              src={komtekGraphic}
              alt="Cybersikkerhet og datakommunikasjon"
            />
          </div>
          <div className={styles.body}>
            <span className={styles.title}>
              Cybersikkerhet og datakommunikasjon
            </span>
            <div className={styles.textGroup}>
              <span className={styles.text}>
                Vi lever stadig mer av livene våre på nett. Sikkerhet blir bare
                viktigere.
              </span>
              <a
                className={styles.textLink}
                href="https://www.ntnu.no/studier/mtkom"
                rel="noreferrer"
                target="_blank"
              >
                Sjekk ut studiet{' '}
                <ChevronRight className={styles.arrow} size={14} />
              </a>
            </div>
          </div>
        </BaseCard>
      </div>
    </section>
  );
};

export default UsefulLinks;
