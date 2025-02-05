import { Flex, Icon, LinkButton, Image, Page } from '@webkom/lego-bricks';
import { Download } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import logosDonts from 'app/assets/logos-donts.png';
import logosDos from 'app/assets/logos-dos.png';
import { ContentMain } from 'app/components/Content';
import styles from './BrandPage.module.css';

const BrandPage = () => {
  const title = 'Retningslinjer for merkevare';
  return (
    <Page title={title}>
      <Helmet title={title} />
      <ContentMain>
        <p>
          PR har utformet noen retningslinjer for å hjelpe deg å bruke vår
          merkevare. For å bruke logoen og designet på en måte som ikke er
          dekket av disse retningslinjene kontakt oss på{' '}
          <a href="mailto:pr@abakus.no">pr@abakus.no</a> og legg ved en mockup
          av hvordan du har tenkt til å bruke det.
        </p>
        <div>
          <h2>Bruk</h2>
          <p>
            Abakus{"'"} merker inkluderer Abakus-navnet, logoen og ord som
            identifiserer oss. Vær så snill å ikke modifiser merkene eller bruk
            dem på en forvirrende måte.
          </p>
        </div>
        <Flex>
          <Flex column className={styles.colLeft}>
            <h2>Logo</h2>
            <p>
              Det finnes to versjoner av Abakus-logoen. Én med svart tekst,
              laget for lyse bakgrunner og én med hvit tekst til bruk på mørke
              bakgrunner. Bruk den som gir best kontrast til bakgrunnen!
            </p>
            <p>
              Bruk logoen fra denne siden som er i høy oppløsning og ikke et
              screenshot fra abakus.no eller Facebook.
            </p>
            <p>
              Når logoen brukes sammen med andre logoer, sørg for at det er en
              marg tilsvarende 200% av størrelsen til logoen.
            </p>
          </Flex>
          <Flex column className={styles.colRight}>
            <Image
              src={logosDos}
              alt="Eksempler på tillatte versjoner av logo"
              width={200}
            />
          </Flex>
        </Flex>
        <Flex>
          <Flex column className={styles.colLeft}>
            <b>Vi ber om at du er omtenksom og ikke:</b>
            <ul>
              <li>
                Bruker andre logoer eller lignende bilder til å representere
                Abakus
              </li>
              <li>Roterer logoen</li>
              <li>Endrer farger på logoen</li>
              <li>Dekker til deler av logoen</li>
              <li>
                Bruker kula for seg selv, fordi da blir det vanskelig å skjønne
                at det er Abakus-logoen
              </li>
              <li>
                Bruker gamle versjoner av merker eller logoen til å representere
                oss
              </li>
              <li>Endrer størrelsen eller forholdet mellom kula og teksten</li>
              <li>Flytter kula eller teksten i forhold til hverandre</li>
              <li>Legge til skygge på logoen</li>
              <li>Gjøre logoen delvis gjennomsiktig</li>
            </ul>
          </Flex>
          <Flex column className={styles.colRight}>
            <Image
              src={logosDonts}
              alt="Eksempler på ikke-tillatte versjoner av logo"
              width={200}
            />
          </Flex>
        </Flex>
        <div>
          <h2>Logoer i vektorformat</h2>
          <LinkButton
            href="https://github.com/abakus-ntnu/grafisk-profil/archive/master.zip"
            download="proposed_file_name"
          >
            <Icon iconNode={<Download />} size={19} />
            Last ned
          </LinkButton>
        </div>
        <div>
          <h2>Abakusfarger</h2>
          <ul>
            <li>Hvit: CMYK(0,0,0,0)</li>
            <li>Svart: CMYK(0,0,0,95)</li>
            <li>Lysegrå: CMYK(48,39,42,39) RGB(525251)</li>
            <li>Grå: CMYK(53,44,46,52) RGB(343434)</li>
            <li>Lyserød: CMYK(1,98,98,0) RGB(E21617)</li>
            <li>Mørkerød: CMYK(20,99,100,13) RGB(B21C17)</li>
          </ul>
        </div>
        <div>
          <h2>PowerPoint-mal</h2>
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
      </ContentMain>
    </Page>
  );
};

export default BrandPage;
