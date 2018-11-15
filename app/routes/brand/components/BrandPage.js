import React from 'react';

import { Content } from 'app/components/Content';
import NavigationTab from 'app/components/NavigationTab';
import styles from './BrandPage.css';
import Button from 'app/components/Button';
import logosDos from 'app/assets/logos-dos.png';
import logosDonts from 'app/assets/logos-donts.png';
import { Flex } from 'app/components/Layout';

const BrandPage = () =>
  <Content>
    <NavigationTab title="Brand Guidelines" />
    <section>
      <Flex className={styles.root}>
        <p>
          Hei, vi i PR har laget noen retningslinjer for å hjelpe deg å
          bruke vårt brand og design. For å bruke logoen og designet på
          en måte som ikke er dekket av disse retningslinjene
          kontakt oss på <a className={styles.inlineLink} href="mailto:abakus@abakus.no">pr@abakus.no</a>
          og legg ved en mockup av hvordan du har tenkt til å bruke det.
        </p>
        <h2>Bruk</h2>
            <p>
              Abakus{"'"} merker inkluderer Abakus-navnet, logoen og ord som
              identifiserer oss. Vær så snill å ikke modifiser merkene eller bruk
              dem på en forvirrende måte.
            </p>
        <Flex row>
          <Flex column className={styles.colLeft}>
            <h2>Logo</h2>
            <p>
              Det finnes to versjoner av Abakus-logoen. Én med svart tekst, laget
              for lyse bakgrunner og én med hvit tekst til bruk på mørke
              bakgrunner. Bruk den som gir best kontrast til bakgrunnen!
            </p>
            <p>
              Bruk logoen fra denne siden som er i høy oppløsning og ikke
              et screenshot fra abakus.no eller Facebook.
            </p>
            <p>
              Når logoen brukes sammen med andre logoer, sørg for at det er en
              marg tilsvarende 200% av størrelsen til logoen.
            </p>
          </Flex>
          <Flex column className={styles.colRight}>
            <img src={logosDos} width={200} />
          </Flex>
        </Flex>

        <Flex row>
          <Flex column className={styles.colLeft}>
            <b>Vi ber om at du er omtenksom og ikke:</b>
            <ul>
              <li>Bruker andre logoer eller lignende bilder til å representere Abakus</li>
              <li>Roterer logoen</li>
              <li>Endrer farger på logoen</li>
              <li>Dekker til deler av logoen</li>
              <li>Bruker gamle versjoner av merker eller logoen til å representere oss</li>
              <li>Endrer størrelsen eller forholdet mellom kula og teksten</li>
              <li>Flytter kula eller teksten</li>
              <li>Bruker kula for seg selv, fordi da blir det vanskelig å skjønne at det er Abakus-logoen</li>
            </ul>
          </Flex>
          <Flex column className={styles.colRight}>
            <img src={logosDonts} width={200} />
          </Flex>
        </Flex>
          <div>
            <h2>Logoer i vektorformat</h2>
            <Button>
              <a href="https://github.com/abakus-ntnu/grafisk-profil/archive/master.zip" download="proposed_file_name">Last Ned</a>
            </Button>
          </div>
      </Flex>
    </section>
  </Content>;


export default BrandPage;
