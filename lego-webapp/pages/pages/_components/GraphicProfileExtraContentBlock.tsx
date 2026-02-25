import { Flex, LinkButton, Image, Icon } from '@webkom/lego-bricks';
import { Download } from 'lucide-react';
import styles from './GraphicProfileExtraContentBlock.module.css';
import logosDonts from '~/assets/logos-donts.png';
import logosDos from '~/assets/logos-dos.png';

const GraphicProfileExtraContentBlock = () => (
  <>
    <Flex justifyContent="space-between">
      <Flex
        className={styles.textContent}
        column
        gap={'var(--spacing-xl)'}
        width={'45%'}
      >
        <div>
          <h3 className={styles.heading}>Logoer i vektorformat</h3>
          <p>Nedlastningslenke for logoer i vektorformat</p>
          <LinkButton
            href="https://github.com/abakus-ntnu/grafisk-profil/archive/master.zip"
            download="proposed_file_name"
          >
            <Icon iconNode={<Download />} size={19} />
            Last ned
          </LinkButton>
        </div>
        <div>
          <h3 className={styles.heading}>PowerPoint-mal</h3>
          <p>
            Denne malen skal brukes for presentasjoner som holdes i Abakus-regi
          </p>
          <LinkButton
            href="https://github.com/abakus-ntnu/grafisk-profil/blob/master/maler/Abakus%20-%20Presentasjonsmal.pptx?raw=true"
            download="proposed_file_name"
          >
            <Icon iconNode={<Download />} size={19} />
            Last ned
          </LinkButton>
        </div>
        <div>
          <h3 className={styles.heading}>Abakusfarger</h3>
          <ul>
            <li>Hvit: CMYK(0,0,0,0)</li>
            <li>Svart: CMYK(0,0,0,95)</li>
            <li>Lysegrå: CMYK(48,39,42,39) RGB(525251)</li>
            <li>Grå: CMYK(53,44,46,52) RGB(343434)</li>
            <li>Lyserød: CMYK(1,98,98,0) RGB(E21617)</li>
            <li>Mørkerød: CMYK(20,99,100,13) RGB(B21C17)</li>
          </ul>
        </div>
      </Flex>
      <Flex
        className={styles.imageLogos}
        column
        width={'45%'}
        padding={'var(--spacing-md)'}
      >
        <Image src={logosDos} alt="Eksempler på tillatte versjoner av logo" />
        <Image
          src={logosDonts}
          alt="Eksempler på ikke-tillatte versjoner av logo"
        />
      </Flex>
    </Flex>
  </>
);

export default GraphicProfileExtraContentBlock;
