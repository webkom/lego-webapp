import React from 'react';
import { Link } from 'react-router';
import { DisplayVisionShort } from './DisplayVision';
import { Content } from 'app/components/Content';
import TextWithRedTitle, { TextWithTitle } from 'app/components/TextWithTitle';
import Statistic from 'app/components/Statistic';
import EmailItem from 'app/components/EmailItem';
import Icon from 'app/components/Icon';
import styles from './LandingPage.css';
import banner from 'app/assets/about-us-banner.png';

const LandingPage = ({
  whoWeAre,
  whatWeDo,
  whyWeDoIt,
  postAddress,
  officeHours,
  officeAddress,
  webkomOfficeAddress,
  organizationNo
}) => {
  return (
    <Content className={styles.pageContainer}>
      <Link to={'/pages/info/17-strategidokument'}>-> Vision page</Link>
      <a href="#contact" className={styles.contactUsLink}>
        Kontakt oss
      </a>
      <img
        className={styles.banner}
        src={banner}
        alt="Abakus - Linjeforeningen for Datateknologi og Kommunikasjonsteknologi ved NTNU"
      />

      <div className={styles.whoWhatWhyContainer}>
        <TextWithRedTitle title="Hvem vi er" text={whoWeAre} />
        <TextWithRedTitle title="Hva vi gjør" text={whatWeDo} />
        <TextWithRedTitle title="Hvorfor vi gjør det" text={whyWeDoIt} />
      </div>

      <div className={styles.statisticsContainer}>
        <Statistic statistic="9" label="Komiteer" />
        <Statistic statistic="13" label="Undergrupper" />
        <Statistic statistic="16" label="Interessegrupper" />
        <Statistic statistic="900+" label="Medlemmer" />
        <Statistic topLabel="Stiftet i" statistic="1977" label="41 år" />
      </div>

      <DisplayVisionShort />

      <div className={styles.contactTitleContainer}>
        <h2 className={styles.contactTitle} id="contact">
          Kontakt oss
        </h2>
      </div>

      <div className={styles.locationContainer}>
        <Icon name="home" size={80} style={{ marginRight: '1rem' }} />
        <TextWithTitle
          title="Postadresse"
          text={postAddress}
          extraStyle={{ flexBasis: '33.33333%' }}
        />
        <div style={{ flexBasis: '33.33333%' }}>
          <TextWithTitle title="Besøksadresse" text={officeAddress} />
          <TextWithTitle
            title="Webkom's besøksadresse"
            text={webkomOfficeAddress}
          />
        </div>
        <TextWithTitle
          title="Kontortid"
          text={officeHours}
          extraStyle={{ flexBasis: '33.33333%' }}
        />
      </div>

      <div className={styles.emailContainer}>
        <Icon name="mail" size={80} style={{ marginRight: '1rem' }} />
        <div>
          <h3 className={styles.title}>E-post</h3>
          <EmailItem recipient="Hovedstyret" email="abakus@abakus.no" />

          <h3 className={styles.title}>E-postadresser til komiteene</h3>
          <div className={styles.committeeEmails}>
            <EmailItem recipient="Arrkom" email="arrkom@abakus.no" />
            <EmailItem recipient="PR" email="pr@abakus.no" />
            <EmailItem recipient="Koskom" email="koskom@abakus.no" />
            <EmailItem recipient="Bedkom" email="bedkom@abakus.no" />
            <EmailItem recipient="LaBamba" email="labamba@abakus.no" />
            <EmailItem recipient="Webkom" email="webkom@abakus.no" />
            <EmailItem recipient="Fagkom" email="fagkom@abakus.no" />
            <EmailItem recipient="readme" email="readme@abakus.no" />
            <EmailItem recipient="backup" email="backup@abakus.no" />
          </div>
        </div>
      </div>

      <div className={styles.organizationContainer}>
        <Icon name="briefcase" size={80} style={{ marginRight: '1rem' }} />
        <div>
          <h3 className={styles.title}>Organisasjonsnummer</h3>
          <span>{organizationNo}</span>
        </div>
      </div>
    </Content>
  );
};

LandingPage.defaultProps = {
  whoWeAre:
    'Abakus er linjeforeningen for studentene ved Datateknologi og Kommunikasjonsteknologi på NTNU, og drives av studenter ved disse studiene.',
  whatWeDo:
    "Abakus' formål er å disse studentene veiledning i studiesituasjonen, arrangere kurs som utfyller fagtilbudet ved NTNU, fremme kontakten med næringslivet og bidra med sosiale aktiviteter.",
  whyWeDoIt:
    'Vi jobber for å være et mangfoldig miljø og aktivitetstilbud, med muligheter for alle våre studenter, og et sted morgendagens IT-studenter vil være.',
  postAddress: 'Abakus \nSem Sælands vei 7-9 \n7491 Trondheim',
  officeAddress: 'Realfagsbygget A-blokka \nTredje etasje, rom A3.133',
  webkomOfficeAddress:
    'EL-bygget rom F-252 \nO.S. Bragstads plass 2F \nNTNU Gløshaugen',
  officeHours: 'Hver torsdag kl. 1215 - 1300',
  organizationNo: '98 60 37 314 MVA'
};

export default LandingPage;
