import { Card, LinkButton } from '@webkom/lego-bricks';
import cx from 'classnames';
import Auth from '~/components/Auth';
import styles from './Hero.module.css';
import { beads, beadRight, beadRowCenter, beadTop } from './heroBeads';
import useScrambleText from './useScrambleText';
import useTitleBeadAnimation from './useTitleBeadAnimation';
import type { CSSProperties } from 'react';

type StudyChipProps = {
  href: string;
  label: string;
};

const TypedChip = ({ href, label }: StudyChipProps) => (
  <a
    className={cx(styles.studyChip, styles.typedChip)}
    href={href}
    rel="noreferrer"
    target="_blank"
    style={{ '--chars': label.length } as CSSProperties}
  >
    <span className={styles.typedText}>{label}</span>
  </a>
);

const ScrambledChip = ({ href, label }: StudyChipProps) => {
  const textRef = useScrambleText(label);

  return (
    <a
      className={styles.studyChip}
      href={href}
      rel="noreferrer"
      target="_blank"
      aria-label={label}
      style={{ '--chars': label.length } as CSSProperties}
    >
      <span className={styles.scrambledText} ref={textRef} aria-hidden="true">
        {label}
      </span>
    </a>
  );
};

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
              data-row-center={beadRowCenter(bead)}
              className={cx(
                styles.bead,
                styles[`bead${bead.slide}`],
                bead.dark && styles.beadDark,
              )}
              style={{
                top: beadTop(bead),
                right: beadRight(bead),
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
              <TypedChip
                href="https://www.ntnu.no/studier/mtdt"
                label="Datateknologi"
              />{' '}
              og{' '}
              <ScrambledChip
                href="https://www.ntnu.no/studier/mtkom"
                label="Cybersikkerhet og datakommunikasjon"
              />{' '}
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
