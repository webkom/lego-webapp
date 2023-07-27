import cx from 'classnames';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import bannerDarkMode from 'app/assets/om-abakus-banner-dark-mode.png';
import bannerLightMode from 'app/assets/om-abakus-banner.png';
import Button from 'app/components/Button';
import Icon from 'app/components/Icon';
import { Image } from 'app/components/Image';
import { Flex } from 'app/components/Layout';
import type { PageRenderer } from 'app/routes/pages/components/PageDetail';
import styles from './LandingPage.css';
import { DisplayVisionShort } from './subcomponents/DisplayVision';
import EmailItem from './subcomponents/EmailItem';
import Statistic from './subcomponents/Statistic';
import TextWithBoldTitle, {
  TextWithTitle,
} from './subcomponents/TextWithTitle';

const LandingPage: PageRenderer = ({ loggedIn }) => {
  return (
    <div className={styles.pageContainer}>
      <a href="#contact" className={styles.contactUsLink}>
        Kontakt oss
      </a>
      <Image
        className={cx(styles.banner, styles.bannerLightMode)}
        src={bannerLightMode}
        alt="Abakus - Linjeforeningen for Datateknologi og Kommunikasjonsteknologi og digital sikkerhet ved NTNU"
        height="265"
      />

      <Image
        className={cx(styles.banner, styles.bannerDarkMode)}
        src={bannerDarkMode}
        alt="Abakus - Linjeforeningen for Datateknologi og Kommunikasjonsteknologi og digital sikkerhet ved NTNU"
        height="265"
      />

      <Flex className={styles.whoWhatWhyContainer}>
        <TextWithBoldTitle title="Hvem vi er" text={info.whoWeAre} />
        <TextWithBoldTitle title="Hva vi gjør" text={info.whatWeDo} />
        <TextWithBoldTitle title="Hvorfor vi gjør det" text={info.whyWeDoIt} />
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
        <Statistic statistic="10" label="Komiteer" />
        <Statistic statistic="5" label="Undergrupper" />
        <Statistic statistic="32" label="Interessegrupper" />
        <Statistic statistic="1000+" label="Medlemmer" />
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
        <Icon name="mail" size={40} className={styles.emailIcon} />
        <div className={styles.emails}>
          <h3 className={styles.title}>E-post</h3>
          {loggedIn && (
            <div>
              Har du noe du vil spørre om eller fortelle oss? Ta kontakt med oss
              på vårt <Link to="/contact">kontaktskjema</Link> eller på
              e-postene under! På kontaktskjemaet har du mulighet til å sende
              anonyme beskjeder, og du kan lett velge hvem som skal få mailen
              din. Abakus har også en{' '}
              <a
                href="https://avvik.abakus.no"
                rel="noopener noreferrer"
                target="_blank"
              >
                varslingsportal
              </a>{' '}
              som kan brukes til anonym varsling.
            </div>
          )}
          <EmailItem
            recipient="Hovedstyret"
            email="abakus@abakus.no"
            logo="https://raw.githubusercontent.com/webkom/lego/master/assets/abakus_hs.png"
          />
          <h3 className={styles.title}>E-postadresser til komiteene</h3>
          <Flex wrap>
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
        <Icon name="people" size={40} className={styles.emailIcon} />
        <div className={styles.emails}>
          <h3 className={styles.title}>Sosiale medier</h3>
          <div>
            Har du lyst til å følge med på hva de forskjellige delene av abakus
            driver med? Følg oss på sosiale medier!
          </div>
          <Flex wrap>
            <div className={styles.socialMediaType}>
              <Icon name="logo-facebook" size={40} />
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
              <Icon name="logo-instagram" size={40} />
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
          <Icon name="home" size={40} />
        </div>
        <Flex wrap>
          <div className={styles.locationContainerItem}>
            <TextWithTitle
              title="Besøksadresse"
              text={info.officeAddress}
              extraStyle={{ margin: 0 }}
            />
            <TextWithTitle
              title="Webkom sin besøksadresse"
              text={info.webkomOfficeAddress}
              extraStyle={{ margin: 0 }}
            />
          </div>
          <TextWithTitle
            title="Postadresse"
            text={info.postAddress}
            extraClassName={styles.locationContainerItem}
          />
          <TextWithTitle
            title="Kontortid"
            text={info.officeHours}
            extraClassName={styles.locationContainerItem}
          />
        </Flex>
      </Flex>

      <Flex alignItems="center">
        <Icon name="briefcase" size={40} className={styles.organizationIcon} />
        <div className={styles.organization}>
          <h3 className={styles.title}>Organisasjonsnummer</h3>
          <span>{info.organizationNo}</span>
        </div>
      </Flex>
    </div>
  );
};

const info = {
  whoWeAre: (
    <span>
      Abakus er linjeforeningen for studentene ved Datateknologi og{' '}
      <i>Kommunikasjonsteknologi og digital sikkerhet</i> på NTNU, og drives av
      studenter ved disse studiene.
    </span>
  ),
  whatWeDo:
    "Abakus' formål er å gi disse studentene veiledning i studiesituasjonen, arrangere kurs som utfyller fagtilbudet ved NTNU, fremme kontakten med næringslivet og bidra med sosiale aktiviteter.",
  whyWeDoIt:
    'Vi jobber for å være et mangfoldig miljø og aktivitetstilbud, med muligheter for alle våre studenter, og et sted morgendagens IT-studenter vil være.',
  postAddress: 'Abakus \nSem Sælands vei 7-9 \n7491 Trondheim',
  officeAddress: 'Realfagsbygget A-blokka \nTredje etasje, rom A3.133',
  webkomOfficeAddress:
    'EL-bygget rom F-252 \nO.S. Bragstads plass 2F \nNTNU Gløshaugen',
  officeHours: 'Hver tirsdag kl. 1315 - 1400 \npå Realfagsbygget',
  organizationNo: '98 60 37 314 MVA',
};
const committeeEmails = [
  {
    recipient: 'Arrkom',
    email: 'arrkom@abakus.no',
    logo: 'https://raw.githubusercontent.com/webkom/lego/master/assets/abakus_arrkom.png',
  },
  {
    recipient: 'Bankkom',
    email: 'bankkom@abakus.no',
    logo: 'https://raw.githubusercontent.com/webkom/lego/master/assets/abakus_bankkom.png',
  },
  {
    recipient: 'Bedkom',
    email: 'bedkom@abakus.no',
    logo: 'https://raw.githubusercontent.com/webkom/lego/master/assets/abakus_bedkom.png',
  },
  {
    recipient: 'Fagkom',
    email: 'fagkom@abakus.no',
    logo: 'https://raw.githubusercontent.com/webkom/lego/master/assets/abakus_fagkom.png',
  },
  {
    recipient: 'Koskom',
    email: 'koskom@abakus.no',
    logo: 'https://raw.githubusercontent.com/webkom/lego/master/assets/abakus_koskom.png',
  },
  {
    recipient: 'LaBamba',
    email: 'labamba@abakus.no',
    logo: 'https://raw.githubusercontent.com/webkom/lego/master/assets/abakus_labamba.png',
  },
  {
    recipient: 'PR',
    email: 'pr@abakus.no',
    logo: 'https://raw.githubusercontent.com/webkom/lego/master/assets/abakus_pr.png',
  },
  {
    recipient: 'Webkom',
    email: 'webkom@abakus.no',
    logo: 'https://raw.githubusercontent.com/webkom/lego/master/assets/abakus_webkom.png',
  },
  {
    recipient: 'readme',
    email: 'readme@abakus.no',
    logo: 'https://raw.githubusercontent.com/webkom/lego/master/assets/abakus_readme.png',
  },
  {
    recipient: 'backup',
    email: 'backup@abakus.no',
    logo: 'https://raw.githubusercontent.com/webkom/lego/master/assets/abakus_backup.png',
  },
];
const socialMedia = {
  facebook: [
    {
      link: 'https://www.facebook.com/AbakusNTNU/?ref=bookmarks',
      textInfo: 'Hovedside for Abakus',
    },
    {
      link: 'https://www.facebook.com/Abakus-Bedriftsarrangementer-245005099523282/',
      textInfo: 'Bedriftsarrangementer',
    },
  ],
  instagram: [
    {
      link: 'https://www.instagram.com/abakusntnu/',
      textInfo: 'Abakus - @Abakusntnu',
    },
    {
      link: 'https://www.instagram.com/abakushs/',
      textInfo: 'Hovedstyret - @abakushs',
    },
    {
      link: 'https://www.instagram.com/abakusbedrift/',
      textInfo: 'Bedrift - @abakusbedrift',
    },
  ],
  snapchat: [
    {
      name: '@abakusntnu',
    },
  ],
};
export default LandingPage;
