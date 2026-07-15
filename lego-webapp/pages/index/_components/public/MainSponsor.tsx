import { Image, LinkButton } from '@webkom/lego-bricks';
import { ChevronRight } from 'lucide-react';
import bekkLogo from '~/assets/bekk_short_white.svg';
import styles from './MainSponsor.module.css';
import useSectionReveal from './useSectionReveal';

const MainSponsor = () => {
  const sectionRef = useSectionReveal();

  return (
    <section className={styles.sponsor} ref={sectionRef}>
      <div className={styles.inner}>
        <div className={styles.brand} data-reveal>
          <p className={styles.eyebrow}>{'// Hovedsamarbeidspartner'}</p>
          <a
            className={styles.wordmark}
            href="https://www.bekk.no/"
            rel="noreferrer"
            target="_blank"
          >
            <Image src={bekkLogo} alt="Bekk sin logo" />
          </a>
          <p className={styles.meta}>Partner siden 2024 · Oslo · Trondheim</p>
        </div>
        <div className={styles.pitch} data-reveal>
          <p className={styles.quote}>
            «Vi lager tjenester som hjelper mennesker i hver by og bygd, krik og
            krok, hver eneste dag. Vi er et fellesskap. Et fagmiljø.»
          </p>
          <div className={styles.actions}>
            <LinkButton
              dark
              href="https://www.bekk.no/"
              rel="noreferrer"
              target="_blank"
            >
              Les mer om Bekk
            </LinkButton>
            <LinkButton
              className={styles.outlineAction}
              href="https://www.bekk.no/jobb"
              rel="noreferrer"
              target="_blank"
            >
              Se karrieremuligheter{' '}
              <ChevronRight className={styles.arrow} size={16} />
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainSponsor;
