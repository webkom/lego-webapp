import React from 'react';
import { Content } from 'app/components/Content';
import NavigationTab from 'app/components/NavigationTab';
import styles from './BrandPage.css';
import Button from '../../../components/Button';

const BrandPage = () => {
  return (
    <Content>
      <NavigationTab title="Brand Guidelines" />
      <section>
        <div className={styles.root}>
          <p>
            Hei, vi i PR har laget noen retningslinjer for å hjelpe deg å
            bruke vårt brand og design. For å bruke logoen og designet på
            en måte som ikke er dekket av disse retningslinjene
            kontakt oss på <a href="mailto:abakus@abakus.no">pr@abakus.no</a>
            og legg ved en mockup av hvordan du har tenkt til å bruke det.
          </p>
          <h2>Bruk</h2>
          <p>
            Abakus{"'"} merker inkluderer Abakus-navnet, logoen og ord som
            identifiserer oss. Vær så snill å ikke modifiser merkene eller bruk
            dem på en forvirrende måte.
          </p>
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
          <h3>Vi ber om at du er omtenksom og ikke:</h3>
          <ul>
            <li>Bruker andre logoer eller lignende bilder til å representere Abakus</li>
            <li>Roterer logoen</li>
            <li>Endrer farger på logoen</li>
            <li>Dekker til deler av logoen</li>
            <li>Bruker gamle versjoner av merker eller logoen til å representere oss</li>
          </ul>
          <h2>Logoer i vektorformat</h2>
          <Button>
            <a href="https://github.com/abakus-ntnu/grafisk-profil/archive/master.zip" download="proposed_file_name">Last Ned</a>
          </Button>
        </div>
      </section>
    </Content>
  );
};


export default BrandPage;
