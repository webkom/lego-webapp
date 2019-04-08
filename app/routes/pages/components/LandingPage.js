//@flow
import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'app/components/Icon';
import { Flex } from 'app/components/Layout';
import { DisplayVisionShort } from './subcomponents/DisplayVision';
import TextWithBoldTitle, {
  TextWithTitle
} from './subcomponents/TextWithTitle';
import Statistic from './subcomponents/Statistic';
import EmailItem from './subcomponents/EmailItem';
import banner from 'app/assets/om-abakus-banner.png';
import styles from './LandingPage.css';
import Button from 'app/components/Button';
import moment from 'moment-timezone';
import { Image } from 'app/components/Image';

type Props = {
  whoWeAre: string,
  whatWeDo: string,
  whyWeDoIt: string,
  postAddress: string,
  officeHours: string,
  officeAddress: string,
  webkomOfficeAddress: string,
  organizationNo: string,
  loggedIn: boolean
};

const LandingPage = ({
  whoWeAre,
  whatWeDo,
  whyWeDoIt,
  postAddress,
  officeHours,
  officeAddress,
  webkomOfficeAddress,
  organizationNo,
  loggedIn
}: Props) => {
  return (
    <div className={styles.pageContainer}>
      <a href="#contact" className={styles.contactUsLink}>
        Kontakt oss
      </a>
      <Image
        className={styles.banner}
        src={banner}
        alt="Abakus - Linjeforeningen for Datateknologi og Kommunikasjonsteknologi ved NTNU"
      />

      <Flex className={styles.whoWhatWhyContainer}>
        <TextWithBoldTitle title="Hvem vi er" text={whoWeAre} />
        <TextWithBoldTitle title="Hva vi gjør" text={whatWeDo} />
        <TextWithBoldTitle title="Hvorfor vi gjør det" text={whyWeDoIt} />
      </Flex>

      <h2 className={styles.abakusInNumbers} id="abakusInNumbers">
        Abakus i tall
      </h2>
      <Flex
        wrap
        className={styles.statisticsContainer}
        alignItems="flex-end"
        justifyContent="center"
      >
        <Statistic statistic="9" label="Komiteer" />
        <Statistic statistic="3" label="Undergrupper" />
        <Statistic statistic="24" label="Interessegrupper" />
        <Statistic statistic="800+" label="Medlemmer" />
        <Statistic
          topLabel="Stiftet i"
          statistic="1977"
          label={`${moment().year() - 1977} år`}
        />
      </Flex>

      <DisplayVisionShort />

      <h2 className={styles.contactTitle} id="contact">
        Kontakt oss
      </h2>

      <Flex className={styles.emailContainer}>
        <Icon name="mail" size={80} className={styles.emailIcon} />
        <div className={styles.emails}>
          <h3 className={styles.title}>E-post</h3>
          {loggedIn && (
            <div>
              Har du noe du vil spørre om eller fortelle oss? Ta kontakt med oss
              på vårt <Link to="/contact">kontaktskjema</Link> eller på
              e-postene under! På kontaktskjemaet har du mulighet til å sende
              anonyme beskjeder, og du kan lett velge hvem som skal få mailen
              din.
            </div>
          )}
          <EmailItem
            recipient="Hovedstyret"
            email="abakus@abakus.no"
            logo="https://raw.githubusercontent.com/webkom/lego/master/assets/abakus_hs.png"
          />
          <h3 className={styles.title}>E-postadresser til komiteene</h3>
          <Flex wrap className={styles.committeeEmails}>
            {committeeEmails.map((email, index) => (
              <EmailItem
                key={index}
                recipient={email.recipient}
                email={email.email}
                logo={email.logo}
              />
            ))}
          </Flex>
        </div>
      </Flex>

      <Flex className={styles.socialMediaContainer}>
        <Icon name="people" size={80} className={styles.emailIcon} />
        <div className={styles.emails}>
          <h3 className={styles.title}>Sosiale medier</h3>
          <div>
            Har du lyst til å følge med på hva de forskjellige delene av abakus
            driver med? Følg oss på sosiale medier!
          </div>
          <Flex wrap className={styles.committeeEmails}>
            <div className={styles.socialMediaType}>
              <Icon name="logo-facebook" size={40} prefix="ion-" />
              <div className={styles.socialMediaTypeLinks}>
                {socialMedia.facebook.map((page, index) => (
                  <a
                    key={index}
                    href={page.link}
                    className={styles.socialMediaLink}
                  >
                    {page.textInfo}
                  </a>
                ))}
                {loggedIn && (
                  <a
                    href="https://www.facebook.com/groups/398146436914007/"
                    className={styles.socialMediaLink}
                  >
                    Medlemsgruppe
                  </a>
                )}
              </div>
            </div>
            <div className={styles.socialMediaType}>
              <Icon name="logo-instagram" size={40} prefix="ion-" />
              <div className={styles.socialMediaTypeLinks}>
                {socialMedia.instagram.map((page, index) => (
                  <a
                    key={index}
                    href={page.link}
                    className={styles.socialMediaLink}
                  >
                    {page.textInfo}
                  </a>
                ))}
              </div>
            </div>
            <div className={styles.socialMediaType}>
              <Icon
                name="logo-snapchat"
                size={40}
                prefix="ion-"
                className={styles.snapchatIcon}
              />
              <div className={styles.socialMediaTypeLinks}>
                {socialMedia.snapchat.map((page, index) => (
                  <Button flat key={index} className={styles.socialMediaLink}>
                    {page.name}
                  </Button>
                ))}
              </div>
            </div>
          </Flex>
        </div>
      </Flex>

      <Flex className={styles.locationContainer}>
        <div className={styles.houseIcon}>
          <Icon name="home" size={80} style={{ marginRight: '1rem' }} />
        </div>
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
      </Flex>

      <Flex>
        <Icon name="briefcase" size={80} className={styles.organizationIcon} />
        <div className={styles.organization}>
          <h3 className={styles.title}>Organisasjonsnummer</h3>
          <span>{organizationNo}</span>
        </div>
      </Flex>
    </div>
  );
};

LandingPage.defaultProps = {
  whoWeAre:
    'Abakus er linjeforeningen for studentene ved Datateknologi og Kommunikasjonsteknologi på NTNU, og drives av studenter ved disse studiene.',
  whatWeDo:
    "Abakus' formål er å gi disse studentene veiledning i studiesituasjonen, arrangere kurs som utfyller fagtilbudet ved NTNU, fremme kontakten med næringslivet og bidra med sosiale aktiviteter.",
  whyWeDoIt:
    'Vi jobber for å være et mangfoldig miljø og aktivitetstilbud, med muligheter for alle våre studenter, og et sted morgendagens IT-studenter vil være.',
  postAddress: 'Abakus \nSem Sælands vei 7-9 \n7491 Trondheim',
  officeAddress: 'Realfagsbygget A-blokka \nTredje etasje, rom A3.133',
  webkomOfficeAddress:
    'EL-bygget rom F-252 \nO.S. Bragstads plass 2F \nNTNU Gløshaugen',
  officeHours: 'Hver torsdag kl. 1215 - 1300 \npå Realfagsbygget',
  organizationNo: '98 60 37 314 MVA'
};

const committeeEmails = [
  {
    recipient: 'Arrkom',
    email: 'arrkom@abakus.no',
    logo:
      'https://raw.githubusercontent.com/webkom/lego/master/assets/abakus_arrkom.png'
  },
  {
    recipient: 'Bedkom',
    email: 'bedkom@abakus.no',
    logo:
      'https://raw.githubusercontent.com/webkom/lego/master/assets/abakus_bedkom.png'
  },
  {
    recipient: 'Fagkom',
    email: 'fagkom@abakus.no',
    logo:
      'https://raw.githubusercontent.com/webkom/lego/master/assets/abakus_fagkom.png'
  },
  {
    recipient: 'Koskom',
    email: 'koskom@abakus.no',
    logo:
      'https://raw.githubusercontent.com/webkom/lego/master/assets/abakus_koskom.png'
  },
  {
    recipient: 'LaBamba',
    email: 'labamba@abakus.no',
    logo:
      'https://raw.githubusercontent.com/webkom/lego/master/assets/abakus_labamba.png'
  },
  {
    recipient: 'PR',
    email: 'pr@abakus.no',
    logo:
      'https://raw.githubusercontent.com/webkom/lego/master/assets/abakus_pr.png'
  },
  {
    recipient: 'Webkom',
    email: 'webkom@abakus.no',
    logo:
      'https://raw.githubusercontent.com/webkom/lego/master/assets/abakus_webkom.png'
  },
  {
    recipient: 'readme',
    email: 'readme@abakus.no',
    logo:
      'https://raw.githubusercontent.com/webkom/lego/master/assets/abakus_readme.png'
  },
  {
    recipient: 'backup',
    email: 'backup@abakus.no',
    logo:
      'https://raw.githubusercontent.com/webkom/lego/master/assets/abakus_backup.png'
  }
];

const socialMedia = {
  facebook: [
    {
      link: 'https://www.facebook.com/AbakusNTNU/?ref=bookmarks',
      textInfo: 'Hovedside for Abakus'
    },
    {
      link:
        'https://www.facebook.com/Abakus-Bedriftsarrangementer-245005099523282/',
      textInfo: 'Bedriftsarrangementer'
    }
  ],
  instagram: [
    {
      link: 'https://www.instagram.com/abakusntnu/',
      textInfo: 'Abakus - @Abakusntnu'
    },
    {
      link: 'https://www.instagram.com/abakushs/',
      textInfo: 'Hovedstyret - @abakushs'
    }
  ],
  snapchat: [
    {
      name: '@abakusntnu'
    }
  ]
};

export default LandingPage;
