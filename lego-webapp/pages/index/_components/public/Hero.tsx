import { Card, LinkButton } from '@webkom/lego-bricks';
import cx from 'classnames';
import Auth from '~/components/Auth';
import styles from './Hero.module.css';
import useTitleBeadAnimation from './useTitleBeadAnimation';

type Bead = {
  top: number;
  right: number;
  slide: 'A' | 'B' | 'C';
  duration: number;
  delay?: number;
  opacity?: number;
  dark?: boolean;
  reverse?: boolean;
};

const beads: Bead[] = [
  { top: 13.5, right: 113.5, slide: 'A', duration: 8 },
  {
    top: 13.5,
    right: 353.5,
    slide: 'A',
    duration: 8,
    delay: 1.1,
    opacity: 0.4,
  },
  {
    top: 93.5,
    right: 193.5,
    slide: 'B',
    duration: 3.5,
    opacity: 0.35,
    dark: true,
    reverse: true,
  },
  {
    top: 93.5,
    right: 433.5,
    slide: 'B',
    duration: 3.5,
    delay: 0.9,
    opacity: 0.55,
  },
  {
    top: 133.5,
    right: 133.5,
    slide: 'C',
    duration: 12,
    delay: 0.5,
    opacity: 0.45,
  },
  {
    top: 133.5,
    right: 273.5,
    slide: 'A',
    duration: 7.5,
    delay: 1.3,
    opacity: 0.3,
    dark: true,
    reverse: true,
  },
  {
    top: 133.5,
    right: 473.5,
    slide: 'B',
    duration: 6,
    delay: 0.2,
    opacity: 0.5,
  },
  { top: 173.5, right: 73.5, slide: 'C', duration: 13, opacity: 0.7 },
  {
    top: 173.5,
    right: 313.5,
    slide: 'B',
    duration: 4.5,
    delay: 1,
    opacity: 0.35,
    reverse: true,
  },
  {
    top: 173.5,
    right: 513.5,
    slide: 'C',
    duration: 13,
    delay: 2,
    opacity: 0.25,
    dark: true,
  },
  {
    top: 253.5,
    right: 113.5,
    slide: 'A',
    duration: 6,
    delay: 0.4,
    opacity: 0.3,
    dark: true,
    reverse: true,
  },
  {
    top: 253.5,
    right: 233.5,
    slide: 'B',
    duration: 3,
    delay: 1.6,
    opacity: 0.5,
  },
  {
    top: 253.5,
    right: 453.5,
    slide: 'A',
    duration: 10,
    delay: 0.7,
    opacity: 0.6,
  },
  {
    top: 333.5,
    right: 173.5,
    slide: 'B',
    duration: 7,
    delay: 2.3,
    opacity: 0.45,
  },
  {
    top: 333.5,
    right: 373.5,
    slide: 'C',
    duration: 9,
    delay: 1.4,
    opacity: 0.2,
    dark: true,
    reverse: true,
  },
  {
    top: 413.5,
    right: 93.5,
    slide: 'B',
    duration: 5,
    delay: 0.6,
    opacity: 0.55,
  },
  {
    top: 413.5,
    right: 293.5,
    slide: 'A',
    duration: 8.5,
    delay: 1.8,
    opacity: 0.25,
    dark: true,
    reverse: true,
  },
  {
    top: 333.5,
    right: 493.5,
    slide: 'C',
    duration: 11,
    delay: 0.3,
    opacity: 0.35,
  },
  {
    top: 413.5,
    right: 193.5,
    slide: 'A',
    duration: 9,
    delay: 2.6,
    opacity: 0.45,
  },
  {
    top: 493.5,
    right: 153.5,
    slide: 'A',
    duration: 4,
    delay: 1.2,
    opacity: 0.4,
    reverse: true,
  },
  {
    top: 493.5,
    right: 413.5,
    slide: 'B',
    duration: 9.5,
    delay: 2.1,
    opacity: 0.6,
  },
];

const Hero = () => {
  const {
    containerRef,
    beadFieldRef,
    beadLayerRef,
    titleDotRef,
    travelBeadRef,
  } = useTitleBeadAnimation();

  return (
    <section className={styles.hero}>
      <div className={styles.beadField} aria-hidden="true" ref={beadFieldRef} />
      <div className={styles.inner} ref={containerRef}>
        <div className={styles.beadLayer} aria-hidden="true" ref={beadLayerRef}>
          {beads.map((bead, index) => (
            <span
              key={index}
              data-row-center={bead.top + 6.5}
              className={cx(
                styles.bead,
                styles[`bead${bead.slide}`],
                bead.dark && styles.beadDark,
              )}
              style={{
                top: bead.top,
                right: bead.right,
                opacity: bead.opacity,
                animationDuration: `${bead.duration}s`,
                animationDelay: bead.delay ? `${bead.delay}s` : undefined,
                animationDirection: bead.reverse
                  ? 'alternate-reverse'
                  : 'alternate',
              }}
            />
          ))}
        </div>
        <span
          className={styles.travelBead}
          aria-hidden="true"
          ref={travelBeadRef}
        />
        <div className={styles.content}>
          <div className={styles.intro}>
            <h1 className={cx(styles.title, styles.fadeUp)}>
              Velkommen til Abakus
              <span className={styles.titleDot} ref={titleDotRef} />
            </h1>
            <p className={cx(styles.lead, styles.fadeUp, styles.fadeUpDelay1)}>
              Abakus er linjeforeningen for studentene ved{' '}
              <a
                className={styles.studyChip}
                href="https://www.ntnu.no/studier/mtdt"
                rel="noreferrer"
                target="_blank"
              >
                Datateknologi
              </a>{' '}
              og{' '}
              <a
                className={styles.studyChip}
                href="https://www.ntnu.no/studier/mtkom"
                rel="noreferrer"
                target="_blank"
              >
                Cybersikkerhet og datakommunikasjon
              </a>{' '}
              på NTNU, og drives av studenter ved disse studiene.
            </p>
            <p
              className={cx(
                styles.secondaryLead,
                styles.fadeUp,
                styles.fadeUpDelay2,
              )}
            >
              Vi gir veiledning i studiehverdagen, arrangerer kurs som utfyller
              fagtilbudet ved NTNU, fremmer kontakten med næringslivet og bidrar
              med sosiale aktiviteter.
            </p>
            <div
              className={cx(styles.actions, styles.fadeUp, styles.fadeUpDelay3)}
            >
              <LinkButton dark href="/pages/info-om-abakus">
                Les mer om oss
              </LinkButton>
              <LinkButton
                dark
                className={styles.secondaryAction}
                href="/pages/generelt/131-exchange-student"
              >
                Exchange student?
              </LinkButton>
            </div>
          </div>
          <Card
            className={cx(styles.loginCard, styles.fadeUp, styles.fadeUpDelay2)}
          >
            <Auth />
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Hero;
