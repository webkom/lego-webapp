import { Flex, Image, LinkButton } from '@webkom/lego-bricks';
import { ChevronRight } from 'lucide-react';
import bekkLogo from '~/assets/bekk_short_white.svg';
import styles from './MainSponsor.module.css';
import useSectionReveal from './useSectionReveal';

const BEKK_URL = 'https://www.bekk.no/';
const BEKK_CAREERS_URL = 'https://www.bekk.no/jobb';

const MainSponsor = () => {
  const sectionRef = useSectionReveal();

  return (
    <Flex
      column
      component="section"
      className={styles.sponsor}
      componentRef={sectionRef}
    >
      <Flex alignItems="center" className={styles.inner}>
        <Flex
          column
          gap="var(--spacing-md)"
          alignItems="flex-start"
          className={styles.brand}
          data-reveal
        >
          <span className={styles.label}>Hovedsamarbeidspartner</span>
          <Flex
            column
            alignItems="flex-start"
            gap="var(--spacing-sm)"
            component="a"
            className={styles.wordmark}
            href={BEKK_URL}
            rel="noreferrer"
            target="_blank"
          >
            <Image src={bekkLogo} alt="Bekk sin logo" />
          </Flex>
        </Flex>

        <Flex
          column
          alignItems="flex-start"
          gap="var(--spacing-lg)"
          className={styles.pitch}
          data-reveal
        >
          <p className={styles.quote}>
            «Vi lager tjenester som hjelper mennesker i hver by og bygd, krik og
            krok, hver eneste dag. Vi er et fellesskap. Et fagmiljø.»
          </p>
          <Flex wrap gap="var(--spacing-md)" className={styles.actions}>
            <LinkButton dark href={BEKK_URL} rel="noreferrer" target="_blank">
              Les mer om Bekk
            </LinkButton>
            <LinkButton
              className={styles.outlineAction}
              href={BEKK_CAREERS_URL}
              rel="noreferrer"
              target="_blank"
            >
              Se karrieremuligheter{' '}
              <ChevronRight className={styles.arrow} size={16} />
            </LinkButton>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default MainSponsor;
