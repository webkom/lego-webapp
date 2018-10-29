import React from 'react';
import { Content } from 'app/components/Content';
import NavigationTab from 'app/components/NavigationTab';
import styles from './BrandPage.css';

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
            Abakus' merker inkluderer Abakus-navnet, logoen og ord som
            identifiserer oss. Vær så snill å ikke modifiser merkene eller bruk
            dem på en forvirrende måte.
          </p>
        </div>
      </section>
    </Content>
  );
}


export default BrandPage;
